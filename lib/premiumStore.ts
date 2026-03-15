import { readMutableJsonStore, resolveDataFile, writeMutableJsonStore } from "@/lib/mutableJsonStore";

export type PremiumPlan = "free" | "premium";
export type SubscriptionStatus =
  | "inactive"
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "incomplete"
  | "incomplete_expired"
  | "paused";
export type BillingInterval = "month" | "year" | null;

export type UserBillingRecord = {
  userId: string;
  plan: PremiumPlan;
  subscriptionStatus: SubscriptionStatus;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripeCheckoutSessionId: string | null;
  stripePriceId: string | null;
  billingInterval: BillingInterval;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
  updatedAt: string;
};

type BillingStore = Record<string, UserBillingRecord>;

const STORE_KEY = "premium-users";
const STORE_PATH = resolveDataFile("premium-users.json");

function createDefaultRecord(userId: string): UserBillingRecord {
  return {
    userId,
    plan: "free",
    subscriptionStatus: "inactive",
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    stripeCheckoutSessionId: null,
    stripePriceId: null,
    billingInterval: null,
    cancelAtPeriodEnd: false,
    currentPeriodEnd: null,
    updatedAt: new Date().toISOString()
  };
}

async function readStore(): Promise<BillingStore> {
  return readMutableJsonStore<BillingStore>({
    key: STORE_KEY,
    filePath: STORE_PATH,
    defaultValue: {}
  });
}

async function writeStore(store: BillingStore) {
  await writeMutableJsonStore({
    key: STORE_KEY,
    filePath: STORE_PATH,
    value: store
  });
}

function normalizeRecord(record: UserBillingRecord): UserBillingRecord {
  return {
    ...record,
    stripePriceId: record.stripePriceId ?? null,
    billingInterval: record.billingInterval ?? null,
    cancelAtPeriodEnd: record.cancelAtPeriodEnd ?? false,
    currentPeriodEnd: record.currentPeriodEnd ?? null
  };
}

export function shouldKeepPremiumForStatus(status: SubscriptionStatus): boolean {
  return status === "active" || status === "trialing" || status === "past_due";
}

export async function getBillingRecord(userId: string): Promise<UserBillingRecord> {
  const store = await readStore();
  return normalizeRecord(store[userId] || createDefaultRecord(userId));
}

export async function upsertBillingRecord(record: UserBillingRecord): Promise<UserBillingRecord> {
  const normalized = normalizeRecord(record);
  const store = await readStore();
  store[normalized.userId] = normalized;
  await writeStore(store);
  return normalized;
}

export async function findUserByStripeCustomerId(stripeCustomerId: string): Promise<UserBillingRecord | null> {
  const store = await readStore();
  return Object.values(store).map(normalizeRecord).find((record) => record.stripeCustomerId === stripeCustomerId) || null;
}

export async function findUserByStripeSubscriptionId(stripeSubscriptionId: string): Promise<UserBillingRecord | null> {
  const store = await readStore();
  return Object.values(store).map(normalizeRecord).find((record) => record.stripeSubscriptionId === stripeSubscriptionId) || null;
}

export async function activatePremiumForUser(input: {
  userId: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripeCheckoutSessionId?: string | null;
  stripePriceId?: string | null;
  billingInterval?: BillingInterval;
  subscriptionStatus?: SubscriptionStatus;
  cancelAtPeriodEnd?: boolean;
  currentPeriodEnd?: string | null;
}) {
  const existing = await getBillingRecord(input.userId);
  const nextStatus = input.subscriptionStatus ?? "active";
  const record: UserBillingRecord = {
    ...existing,
    plan: shouldKeepPremiumForStatus(nextStatus) ? "premium" : existing.plan,
    subscriptionStatus: nextStatus,
    stripeCustomerId: input.stripeCustomerId ?? existing.stripeCustomerId,
    stripeSubscriptionId: input.stripeSubscriptionId ?? existing.stripeSubscriptionId,
    stripeCheckoutSessionId: input.stripeCheckoutSessionId ?? existing.stripeCheckoutSessionId,
    stripePriceId: input.stripePriceId ?? existing.stripePriceId,
    billingInterval: input.billingInterval ?? existing.billingInterval,
    cancelAtPeriodEnd: input.cancelAtPeriodEnd ?? existing.cancelAtPeriodEnd,
    currentPeriodEnd: input.currentPeriodEnd ?? existing.currentPeriodEnd,
    updatedAt: new Date().toISOString()
  };

  return upsertBillingRecord(record);
}

export async function deactivatePremiumForUser(input: {
  userId: string;
  subscriptionStatus?: SubscriptionStatus;
  clearStripeSubscriptionId?: boolean;
  cancelAtPeriodEnd?: boolean;
  currentPeriodEnd?: string | null;
}) {
  const existing = await getBillingRecord(input.userId);
  const record: UserBillingRecord = {
    ...existing,
    plan: "free",
    subscriptionStatus: input.subscriptionStatus ?? "canceled",
    stripeSubscriptionId: input.clearStripeSubscriptionId ? null : existing.stripeSubscriptionId,
    cancelAtPeriodEnd: input.cancelAtPeriodEnd ?? existing.cancelAtPeriodEnd,
    currentPeriodEnd: input.currentPeriodEnd ?? existing.currentPeriodEnd,
    updatedAt: new Date().toISOString()
  };

  return upsertBillingRecord(record);
}

export async function updatePremiumSubscriptionForUser(input: {
  userId: string;
  subscriptionStatus: SubscriptionStatus;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripePriceId?: string | null;
  billingInterval?: BillingInterval;
  cancelAtPeriodEnd?: boolean;
  currentPeriodEnd?: string | null;
}) {
  const existing = await getBillingRecord(input.userId);
  const keepPremium = shouldKeepPremiumForStatus(input.subscriptionStatus);
  const record: UserBillingRecord = {
    ...existing,
    plan: keepPremium ? "premium" : "free",
    subscriptionStatus: input.subscriptionStatus,
    stripeCustomerId: input.stripeCustomerId ?? existing.stripeCustomerId,
    stripeSubscriptionId: input.stripeSubscriptionId ?? existing.stripeSubscriptionId,
    stripePriceId: input.stripePriceId ?? existing.stripePriceId,
    billingInterval: input.billingInterval ?? existing.billingInterval,
    cancelAtPeriodEnd: input.cancelAtPeriodEnd ?? existing.cancelAtPeriodEnd,
    currentPeriodEnd: input.currentPeriodEnd ?? existing.currentPeriodEnd,
    updatedAt: new Date().toISOString()
  };

  return upsertBillingRecord(record);
}

export async function clearStaleStripeSubscriptionForUser(userId: string) {
  const existing = await getBillingRecord(userId);
  const record: UserBillingRecord = {
    ...existing,
    plan: "free",
    subscriptionStatus: "inactive",
    stripeSubscriptionId: null,
    stripeCheckoutSessionId: null,
    stripePriceId: null,
    billingInterval: null,
    cancelAtPeriodEnd: false,
    currentPeriodEnd: null,
    updatedAt: new Date().toISOString()
  };

  return upsertBillingRecord(record);
}
