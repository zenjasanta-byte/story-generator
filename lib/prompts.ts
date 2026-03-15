import type { StoryFormInput, StoryIllustration, StoryPage } from "@/types/story";

export const storytellerSystemPrompt = `You are a professional children's storyteller.
Create warm, kind, safe bedtime stories for children.
Use simple language suitable for the child's age.
Avoid violence, fear, sadness, or disturbing topics.
Make the story engaging and imaginative.
Always include a gentle moral at the end.
Return the result strictly as JSON.`;

const PIXAR_STYLE =
  "Pixar-style 3D animated children's movie scene, soft cinematic lighting, expressive characters, big warm eyes, vibrant colors, detailed environment, depth of field, heartwarming mood, polished 3D render, family-friendly, consistent character design";

const MILA_CHARACTER =
  "Mila is a cute 6-year-old girl with short brown hair, a green hair clip, big brown eyes, a warm yellow sweater, and blue jeans.";

const FOREST_FRIENDS =
  "A small cute white rabbit and a friendly orange fox with expressive faces.";

function resolveCharacterText(sceneText: string): string {
  return /\bmila\b/i.test(sceneText) ? MILA_CHARACTER : "";
}

function resolveAnimalText(sceneText: string): string {
  return /(rabbit|fox)/i.test(sceneText) ? FOREST_FRIENDS : "";
}

export function buildIllustrationPrompt(sceneText: string): string {
  const characterText = resolveCharacterText(sceneText);
  const animalText = resolveAnimalText(sceneText);

  return `${sceneText}. ${characterText} ${animalText} ${PIXAR_STYLE}`.replace(/\s+/g, " ").trim();
}

export function buildStoryUserPrompt(input: StoryFormInput): string {
  const ageGuidance =
    input.age <= 4
      ? "Use very simple short sentences with clear, gentle wording."
      : input.age <= 7
        ? "Use short, easy-to-read sentences with playful detail."
        : "Use simple but slightly richer sentences with gentle adventure.";

  return `Create one personalized children's picture-book story with these parameters:
- Child name: ${input.childName}
- Age: ${input.age}
- Gender: ${input.gender || "not specified"}
- Main character: ${input.mainCharacter}
- Theme: ${input.theme}
- Story length preference: ${input.length}
- Language: ${input.language}
- Style: ${input.style}

Rules:
- Kind, positive, and emotionally safe.
- No scary, violent, dark, or disturbing moments.
- Include the child's name naturally.
- Create exactly 4 connected pages for a picture book.
- Each page must be short and easy to read.
- Each page must have a sceneTitle.
- End with a gentle moral.
- ${ageGuidance}

Return strict JSON with keys:
- title
- pages (exactly 4 items: { pageNumber, text, sceneTitle })
- moral
- age_label`;
}

export function buildNarrationScript(params: {
  title: string;
  pages: StoryPage[];
  moral: string;
  language: string;
  childName?: string;
}): string {
  const sortedPages = params.pages.slice().sort((a, b) => a.pageNumber - b.pageNumber);

  const intro = params.childName
    ? `${params.title}. ${params.childName}.`
    : `${params.title}.`;

  const pagesText = sortedPages
    .map((page) => `${page.sceneTitle}. ${page.text}`)
    .join("\n\n");

  return [
    intro,
    pagesText,
    `${params.moral}`
  ].join("\n\n");
}

export function buildPageNarrationScript(params: {
  title: string;
  page: StoryPage;
  language: string;
  childName?: string;
}): string {
  const intro = params.childName
    ? `${params.title}. ${params.childName}.`
    : `${params.title}.`;

  return [
    intro,
    `${params.page.sceneTitle}.`,
    params.page.text
  ].join("\n\n");
}

export function buildCoverIllustrationPrompt(input: StoryFormInput, title: string, pages: StoryPage[]): string {
  const summary = pages
    .slice()
    .sort((a, b) => a.pageNumber - b.pageNumber)
    .map((page) => `Page ${page.pageNumber}: ${page.sceneTitle} - ${page.text}`)
    .join("\n")
    .slice(0, 900);

  return `Create a front cover illustration for a children's picture book.

Cover context:
- Book title: ${title}
- Child name: ${input.childName}
- Main character: ${input.mainCharacter}
- Story theme: ${input.theme}
- Story summary:\n${summary}

Cover style requirements:
- Warm, colorful, child-friendly picture-book style.
- Safe and comforting mood.
- No scary, dark, violent, or disturbing elements.
- Keep character style consistent with inner story illustrations.
- High-quality illustration.
- No text, logo, or watermark.`;
}

export function buildCoverImageAlt(input: StoryFormInput, title: string): string {
  return `Cover illustration for ${input.childName}'s picture book titled ${title}.`;
}

export function buildPageIllustrationPrompts(
  input: StoryFormInput,
  title: string,
  pages: StoryPage[]
): Array<Pick<StoryIllustration, "pageNumber" | "sceneTitle" | "promptLabel" | "alt"> & { prompt: string }> {
  return pages
    .slice()
    .sort((a, b) => a.pageNumber - b.pageNumber)
    .map((page) => {
      const sceneText = `Title: ${title}. Theme: ${input.theme}. Main character: ${input.mainCharacter}. Child: ${input.childName}. Scene title: ${page.sceneTitle}. Page text: ${page.text}`;

      return {
        pageNumber: page.pageNumber,
        sceneTitle: page.sceneTitle,
        promptLabel: `Page ${page.pageNumber}`,
        alt: `Illustration for page ${page.pageNumber}, ${page.sceneTitle}, from ${title}.`,
        prompt: buildIllustrationPrompt(sceneText)
      };
    });
}
