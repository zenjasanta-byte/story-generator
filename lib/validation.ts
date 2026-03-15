import { z } from "zod";

const MAX_CHILD_NAME_LENGTH = 40;
const MAX_GENDER_LENGTH = 20;
const MAX_MAIN_CHARACTER_LENGTH = 80;
const MAX_THEME_LENGTH = 200;
const MAX_LANGUAGE_LENGTH = 32;

export const storyInputSchema = z.object({
  childName: z.string().trim().min(1, "Child name is required").max(MAX_CHILD_NAME_LENGTH, "Child name is too long"),
  age: z.coerce.number().int().min(2, "Age must be at least 2").max(12, "Age must be 12 or less"),
  gender: z.string().trim().max(MAX_GENDER_LENGTH, "Gender is too long").optional(),
  mainCharacter: z
    .string()
    .trim()
    .min(1, "Main character is required")
    .max(MAX_MAIN_CHARACTER_LENGTH, "Main character is too long"),
  theme: z.string().trim().min(1, "Story theme is required").max(MAX_THEME_LENGTH, "Story theme is too long"),
  length: z.enum(["short", "medium", "long"]),
  language: z.string().trim().min(1, "Language is required").max(MAX_LANGUAGE_LENGTH, "Language is too long"),
  style: z.enum(["bedtime", "educational", "adventure", "friendship"])
});

export const storyPageSchema = z.object({
  pageNumber: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  text: z.string().min(1),
  sceneTitle: z.string().min(1)
});

export const storyOutputSchema = z
  .object({
    title: z.string().min(1),
    pages: z.array(storyPageSchema).length(4),
    moral: z.string().min(1),
    age_label: z.string().min(1)
  })
  .superRefine((value, ctx) => {
    const pageNumbers = value.pages.map((page) => page.pageNumber);
    const unique = new Set(pageNumbers);
    const required = [1, 2, 3, 4] as const;

    if (unique.size !== 4 || required.some((num) => !unique.has(num))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Pages must contain page numbers 1, 2, 3, and 4 exactly once",
        path: ["pages"]
      });
    }
  });

const narrationBaseSchema = z.object({
  title: z.string().trim().min(1, "Story title is required"),
  language: z.string().trim().min(1, "Narration language is required"),
  childName: z.string().trim().optional(),
  isPremium: z.boolean().optional(),
  voiceStyle: z.enum(["gentle", "fairy", "bedtime"]).optional()
});

export const fullNarrationInputSchema = narrationBaseSchema.extend({
  mode: z.literal("full"),
  pages: z.array(storyPageSchema).length(4, "Story must include exactly 4 pages"),
  moral: z.string().trim().min(1, "Story moral is required")
});

export const pageNarrationInputSchema = narrationBaseSchema.extend({
  mode: z.literal("page"),
  page: storyPageSchema
});

export const narrationRequestSchema = z.discriminatedUnion("mode", [fullNarrationInputSchema, pageNarrationInputSchema]);
