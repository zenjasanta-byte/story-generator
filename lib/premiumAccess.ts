export const TEMP_PREMIUM_ACCESS = false;
export const FREE_STORY_LIMIT = 3;
export const FREE_STORY_COUNT_KEY = "storybook_free_story_count";
export const USER_ID_COOKIE = "storybook_user_id";

export type PremiumStatusResponse = {
  userId: string | null;
  isPremium: boolean;
  plan: "free" | "premium";
  subscriptionStatus: "inactive" | "active" | "trialing" | "past_due" | "canceled" | "unpaid" | "incomplete" | "incomplete_expired" | "paused";
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  billingInterval: "month" | "year" | null;
};

export function getPremiumAccess(): boolean {
  return TEMP_PREMIUM_ACCESS;
}

export function getFreeStoryCount(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(FREE_STORY_COUNT_KEY);
  const value = Number(raw || 0);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function incrementFreeStoryCount(): number {
  if (typeof window === "undefined") return 0;
  const next = getFreeStoryCount() + 1;
  window.localStorage.setItem(FREE_STORY_COUNT_KEY, String(next));
  return next;
}

export function hasReachedFreeStoryLimit(isPremium: boolean, count: number): boolean {
  return !isPremium && count >= FREE_STORY_LIMIT;
}
