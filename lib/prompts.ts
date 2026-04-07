import type { StoryFormInput, StoryIllustration, StoryPage } from "@/types/story";

export const storytellerSystemPrompt = `Write safe, warm children's micro-stories. Return strict JSON only.`;

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
  return `Create a safe ${input.language} bedtime micro-story for ${input.childName}, age ${input.age}. Character: ${input.mainCharacter}. Theme: ${input.theme}. Style: ${input.style}. Total story text plus moral must be 80-120 words. Use exactly 4 very short pages. Return JSON: title, pages[{pageNumber,text,sceneTitle}], moral, age_label.`;
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
    .map((page) => page.sceneTitle)
    .join(", ")
    .slice(0, 180);

  return `Cute 3D children's animation still, ${input.mainCharacter}, ${input.theme}, ${title}, scenes: ${summary}. Warm, colorful, safe, no text.`;
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
