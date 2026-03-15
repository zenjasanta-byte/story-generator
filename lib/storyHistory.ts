"use client";

import type { SavedStory, StoryPage } from "@/types/story";

const HISTORY_KEY = "story_generator_history_v1";
const MAX_STORIES = 10;

function normalizePage(page: any, fallbackPageNumber: 1 | 2 | 3 | 4): StoryPage {
  const pageNum = page?.pageNumber;
  const normalizedPageNumber = pageNum === 1 || pageNum === 2 || pageNum === 3 || pageNum === 4 ? pageNum : fallbackPageNumber;

  return {
    pageNumber: normalizedPageNumber,
    text: String(page?.text || ""),
    sceneTitle: String(page?.sceneTitle || `Page ${normalizedPageNumber}`)
  };
}

function normalizePages(output: any): StoryPage[] {
  if (Array.isArray(output?.pages) && output.pages.length > 0) {
    const pages: StoryPage[] = output.pages
      .slice(0, 4)
      .map((page: any, idx: number) => normalizePage(page, (idx + 1) as 1 | 2 | 3 | 4));
    while (pages.length < 4) {
      const next = (pages.length + 1) as 1 | 2 | 3 | 4;
      pages.push({ pageNumber: next, sceneTitle: `Page ${next}`, text: "" });
    }
    return pages.sort((a, b) => a.pageNumber - b.pageNumber);
  }

  const legacyText = String(output?.story || "");
  return [1, 2, 3, 4].map((num) => ({
    pageNumber: num as 1 | 2 | 3 | 4,
    sceneTitle: `Page ${num}`,
    text: num === 1 ? legacyText : ""
  }));
}

function normalizeStories(value: unknown): SavedStory[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item: any) => ({
      id: String(item?.id || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`),
      createdAt: typeof item?.createdAt === "string" ? item.createdAt : new Date().toISOString(),
      input: {
        childName: String(item?.input?.childName || "Unknown"),
        age: Number(item?.input?.age || 0),
        gender: typeof item?.input?.gender === "string" ? item.input.gender : undefined,
        mainCharacter: String(item?.input?.mainCharacter || ""),
        theme: String(item?.input?.theme || ""),
        length:
          item?.input?.length === "short" || item?.input?.length === "medium" || item?.input?.length === "long"
            ? item.input.length
            : "short",
        language: String(item?.input?.language || "Russian"),
        style:
          item?.input?.style === "bedtime" ||
          item?.input?.style === "educational" ||
          item?.input?.style === "adventure" ||
          item?.input?.style === "friendship"
            ? item.input.style
            : "bedtime"
      },
      output: {
        title: String(item?.output?.title || "Untitled Story"),
        pages: normalizePages(item?.output),
        moral: String(item?.output?.moral || ""),
        age_label: String(item?.output?.age_label || ""),
        successfulIllustrations: Number(item?.output?.successfulIllustrations ?? (item?.output?.illustrationUrl ? 1 : 0)),
        totalIllustrations: Number(item?.output?.totalIllustrations ?? (item?.output?.illustrationUrl ? 1 : 0))
      }
    }))
    .slice(0, MAX_STORIES);
}

export function getStoryHistory(): SavedStory[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(HISTORY_KEY);
  if (!raw) return [];

  try {
    return normalizeStories(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function pushStoryHistory(story: SavedStory): SavedStory[] {
  const storyForStorage: SavedStory = {
    ...story,
    output: {
      ...story.output,
      pages: story.output.pages.map((page) => ({
        pageNumber: page.pageNumber,
        sceneTitle: page.sceneTitle,
        text: page.text
      }))
    }
  };

  const current = getStoryHistory();
  const updated = [storyForStorage, ...current].slice(0, MAX_STORIES);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

export function clearStoryHistory() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(HISTORY_KEY);
}
