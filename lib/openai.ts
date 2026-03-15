import {
  buildCoverImageAlt,
  buildCoverIllustrationPrompt,
  buildNarrationScript,
  buildPageNarrationScript,
  buildPageIllustrationPrompts,
  buildStoryUserPrompt,
  storytellerSystemPrompt
} from "@/lib/prompts";
import { buildNarrationStyleInstruction, getAccessibleVoiceStyle, getDefaultVoiceStyle, resolveNarrationVoice } from "@/lib/narrationVoices";
import { storyOutputSchema } from "@/lib/validation";
import type { StoryFormInput, StoryIllustration, StoryPage, StoryResponse, VoiceStyle } from "@/types/story";

const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const OPENAI_IMAGE_API_URL = "https://api.openai.com/v1/images/generations";
const OPENAI_SPEECH_API_URL = "https://api.openai.com/v1/audio/speech";
const OPENAI_MODEL = "gpt-4.1-mini";
const OPENAI_IMAGE_MODEL = "gpt-image-1";
const OPENAI_SPEECH_MODEL = "gpt-4o-mini-tts";
const OPENAI_TIMEOUT_MS = 120000;
const OPENAI_STORY_MAX_OUTPUT_TOKENS = 1400;

export class OpenAIRequestError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "OpenAIRequestError";
    this.status = status;
    this.code = code;
  }
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = OPENAI_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function extractTextPayload(payload: any): string {
  if (typeof payload?.output_text === "string" && payload.output_text.length > 0) {
    return payload.output_text;
  }

  const content = payload?.output?.[0]?.content;
  if (Array.isArray(content)) {
    const textPart = content.find(
      (item: any) => item.type === "output_text" && typeof item.text === "string"
    );
    if (textPart?.text) {
      return textPart.text;
    }
  }

  throw new Error("OpenAI response did not contain output text");
}

async function parseOpenAIError(response: Response): Promise<OpenAIRequestError> {
  const rawText = await response.text();
  let code: string | undefined;
  let message = rawText;

  try {
    const payload = JSON.parse(rawText);
    code = typeof payload?.error?.code === "string" ? payload.error.code : undefined;
    message =
      typeof payload?.error?.message === "string" && payload.error.message.length > 0
        ? payload.error.message
        : rawText;
  } catch {
    // Keep the raw response text if the payload is not JSON.
  }

  return new OpenAIRequestError(
    `OpenAI request failed (${response.status})${code ? ` [${code}]` : ""}: ${message}`,
    response.status,
    code
  );
}

async function generateSingleIllustration(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch(OPENAI_IMAGE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: OPENAI_IMAGE_MODEL,
      prompt,
      size: "1024x1024"
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Image generation failed (${response.status}): ${errText}`);
  }

  const payload = await response.json();
  const b64 = payload?.data?.[0]?.b64_json;
  const url = payload?.data?.[0]?.url;

  if (typeof b64 === "string" && b64.length > 0) {
    return `data:image/png;base64,${b64}`;
  }

  if (typeof url === "string" && url.length > 0) {
    return url;
  }

  throw new Error("Image generation returned no image payload");
}

async function generateCoverIllustration(
  input: StoryFormInput,
  story: Pick<StoryResponse, "title" | "pages">,
  apiKey: string
) {
  const alt = buildCoverImageAlt(input, story.title);

  try {
    const url = await generateSingleIllustration(
      buildCoverIllustrationPrompt(input, story.title, story.pages),
      apiKey
    );
    return { coverImageUrl: url, coverImageAlt: alt };
  } catch (error: unknown) {
    console.error("Cover illustration generation error", error);
    return { coverImageUrl: null, coverImageAlt: alt };
  }
}

async function generateIllustrations(
  input: StoryFormInput,
  story: Pick<StoryResponse, "title" | "pages">,
  apiKey: string
): Promise<StoryIllustration[]> {
  const prompts = buildPageIllustrationPrompts(input, story.title, story.pages);
  const results: StoryIllustration[] = [];

  for (const item of prompts) {
    try {
      const url = await generateSingleIllustration(item.prompt, apiKey);
      results.push({
        pageNumber: item.pageNumber,
        sceneTitle: item.sceneTitle,
        promptLabel: item.promptLabel,
        url,
        alt: item.alt
      });
    } catch (error: unknown) {
      console.error(`Illustration generation error for page ${item.pageNumber}`, error);
      results.push({
        pageNumber: item.pageNumber,
        sceneTitle: item.sceneTitle,
        promptLabel: item.promptLabel,
        url: null,
        alt: item.alt,
        error: "Illustration could not be generated for this page."
      });
    }
  }

  return results.sort((a, b) => a.pageNumber - b.pageNumber);
}

function buildNarrationInstructions(language: string, mode: "full" | "page", voiceStyle?: VoiceStyle): string {
  const styleInstruction = buildNarrationStyleInstruction(voiceStyle);
  const base =
    `Speak entirely in ${language}. ` +
    `Use a natural, accent-neutral, native-sounding delivery for this language whenever possible. ` +
    `Use a soft, warm, calm, bedtime-storytelling tone. ` +
    `${styleInstruction} ` +
    `Use natural pauses and smooth pacing. ` +
    `Do not announce labels or metadata. ` +
    `Do not add commentary before the story.`;

  if (mode === "page") {
    return (
      base +
      ` Read this page like a warm, intimate read-aloud for a child before sleep.`
    );
  }

  return (
    base +
    ` Read the full story like a gentle bedtime audiobook for a child, keeping the voice steady and comforting from beginning to end.`
  );
}

export async function generateNarrationFromScript(params: {
  script: string;
  language: string;
  logLabel: "narration" | "page-narration";
  voiceStyle?: VoiceStyle;
  isPremium?: boolean;
}): Promise<{ audioDataUrl: string; mimeType: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured on the server");
  }

  const resolvedVoiceStyle = getAccessibleVoiceStyle(params.voiceStyle || getDefaultVoiceStyle(), params.isPremium);
  const voice = resolveNarrationVoice(params.language, resolvedVoiceStyle, params.isPremium);
  const mode = params.logLabel === "page-narration" ? "page" : "full";
  const instructions = buildNarrationInstructions(params.language, mode, resolvedVoiceStyle);

  console.log(`[${params.logLabel}] starting generation`, {
    charCount: params.script.length,
    language: params.language,
    voiceStyle: resolvedVoiceStyle,
    voice
  });

  let response = await fetchWithTimeout(OPENAI_SPEECH_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: OPENAI_SPEECH_MODEL,
      voice,
      response_format: "mp3",
      input: params.script,
      instructions
    })
  });

  if (!response.ok) {
    const firstErr = await response.text();
    const fallbackVoice = resolveNarrationVoice(params.language, "bedtime", params.isPremium);
    console.error(`[${params.logLabel}] primary voice failed`, {
      voice,
      fallbackVoice,
      firstErr
    });

    response = await fetchWithTimeout(OPENAI_SPEECH_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: OPENAI_SPEECH_MODEL,
        voice: fallbackVoice,
        response_format: "mp3",
        input: params.script,
        instructions
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[${params.logLabel}] fallback voice failed`, errText);
      throw new Error(`Narration audio generation failed (${response.status}): ${errText}`);
    }
  }

  console.log(`[${params.logLabel}] openai response received`, {
    status: response.status,
    ok: response.ok,
    contentType: response.headers.get("content-type")
  });

  const mimeType = response.headers.get("content-type") || "audio/mpeg";
  const audioBytes = await response.arrayBuffer();

  console.log(`[${params.logLabel}] audio bytes generated`, {
    bytes: audioBytes.byteLength,
    mimeType
  });

  const base64Audio = Buffer.from(audioBytes).toString("base64");

  return {
    audioDataUrl: `data:${mimeType};base64,${base64Audio}`,
    mimeType
  };
}

export async function generateStoryNarrationAudio(input: {
  title: string;
  pages: StoryPage[];
  moral: string;
  language: string;
  childName?: string;
  voiceStyle?: VoiceStyle;
  isPremium?: boolean;
}): Promise<{ audioDataUrl: string; mimeType: string }> {
  const narrationScript = buildNarrationScript(input);
  return generateNarrationFromScript({
    script: narrationScript,
    language: input.language,
    logLabel: "narration",
    voiceStyle: input.voiceStyle,
    isPremium: input.isPremium
  });
}

export async function generatePageNarrationAudio(input: {
  title: string;
  page: StoryPage;
  language: string;
  childName?: string;
  voiceStyle?: VoiceStyle;
  isPremium?: boolean;
}): Promise<{ audioDataUrl: string; mimeType: string }> {
  const pageScript = buildPageNarrationScript(input);
  return generateNarrationFromScript({
    script: pageScript,
    language: input.language,
    logLabel: "page-narration",
    voiceStyle: input.voiceStyle,
    isPremium: input.isPremium
  });
}

export async function generateStoryWithOpenAI(
  input: StoryFormInput,
  options?: { includeImages?: boolean }
): Promise<StoryResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured on the server");
  }

  const includeImages = options?.includeImages ?? true;

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      max_output_tokens: OPENAI_STORY_MAX_OUTPUT_TOKENS,
      input: [
        { role: "system", content: storytellerSystemPrompt },
        { role: "user", content: buildStoryUserPrompt(input) }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "picture_book_response",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              pages: {
                type: "array",
                minItems: 4,
                maxItems: 4,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    pageNumber: { type: "integer", enum: [1, 2, 3, 4] },
                    text: { type: "string" },
                    sceneTitle: { type: "string" }
                  },
                  required: ["pageNumber", "text", "sceneTitle"]
                }
              },
              moral: { type: "string" },
              age_label: { type: "string" }
            },
            required: ["title", "pages", "moral", "age_label"]
          }
        }
      }
    })
  });

  if (!response.ok) {
    throw await parseOpenAIError(response);
  }

  const payload = await response.json();
  const text = extractTextPayload(payload);

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Model returned invalid JSON");
  }

  const storyCore = storyOutputSchema.parse(parsed);
  const sortedPages = [...storyCore.pages].sort((a, b) => a.pageNumber - b.pageNumber);
  const coverAlt = buildCoverImageAlt(input, storyCore.title);

  if (!includeImages) {
    console.log("[openai-story] text-only generation completed", {
      language: input.language,
      title: storyCore.title,
      pages: sortedPages.length,
      generatedAssets: ["story_text"]
    });

    return {
      ...storyCore,
      pages: sortedPages,
      coverImageUrl: null,
      coverImageAlt: coverAlt,
      illustrations: [],
      narrationAudioUrl: null,
      narrationAudioMimeType: null
    };
  }

  const [cover, illustrations] = await Promise.all([
    generateCoverIllustration(input, { title: storyCore.title, pages: sortedPages }, apiKey),
    generateIllustrations(input, { title: storyCore.title, pages: sortedPages }, apiKey)
  ]);

  console.log("[openai-story] full generation completed", {
    language: input.language,
    title: storyCore.title,
    pages: sortedPages.length,
    generatedAssets: ["story_text", "cover_image", "page_illustrations"],
    illustrationCount: illustrations.length,
    successfulIllustrations: illustrations.filter((item) => Boolean(item.url)).length
  });

  return {
    ...storyCore,
    pages: sortedPages,
    coverImageUrl: cover.coverImageUrl,
    coverImageAlt: cover.coverImageAlt,
    illustrations,
    narrationAudioUrl: null,
    narrationAudioMimeType: null
  };
}



