export type StoryLength = "short" | "medium" | "long";
export type StoryStyle = "bedtime" | "educational" | "adventure" | "friendship";
export type VoiceStyle = "gentle" | "fairy" | "bedtime";

export type StoryFormInput = {
  childName: string;
  age: number;
  gender?: string;
  mainCharacter: string;
  theme: string;
  length: StoryLength;
  language: string;
  style: StoryStyle;
};

export type StoryPage = {
  pageNumber: 1 | 2 | 3 | 4;
  text: string;
  sceneTitle: string;
};

export type StoryIllustration = {
  pageNumber: 1 | 2 | 3 | 4;
  sceneTitle: string;
  promptLabel: string;
  url: string | null;
  alt: string;
  error?: string;
};

export type StoryResponse = {
  title: string;
  pages: StoryPage[];
  moral: string;
  age_label: string;
  coverImageUrl: string | null;
  coverImageAlt: string;
  illustrations: StoryIllustration[];
  narrationAudioUrl?: string | null;
  narrationAudioMimeType?: string | null;
  costEstimate?: {
    textUsd: number;
    imageUsd: number;
    audioUsd: number;
    totalUsd: number;
    notes: string[];
  };
};

export type SavedStoryOutput = {
  title: string;
  pages: StoryPage[];
  moral: string;
  age_label: string;
  successfulIllustrations: number;
  totalIllustrations: number;
};

export type SavedStory = {
  id: string;
  createdAt: string;
  input: StoryFormInput;
  output: SavedStoryOutput;
};

