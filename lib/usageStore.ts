import { readMutableJsonStore, resolveDataFile, writeMutableJsonStore } from "@/lib/mutableJsonStore";

export type UserStoryUsageRecord = {
  userId: string;
  storiesGenerated: number;
  dailyStoriesGenerated: number;
  dailyWindowStartedAt: string;
  updatedAt: string;
  credits: number; // 👈 ДОБАВЬ
};

type UsageStore = Record<string, UserStoryUsageRecord>;

const STORE_KEY = "story-usage";
const STORE_PATH = resolveDataFile("story-usage.json");

function createDefaultUsage(userId: string): UserStoryUsageRecord {
  const now = new Date().toISOString();
  return {
  userId,
  storiesGenerated: 0,
  dailyStoriesGenerated: 0,
  dailyWindowStartedAt: now,
  updatedAt: now,
  credits: 10 // 👈 стартовые кредиты
};
}

function isDailyWindowExpired(windowStartedAt: string, now = Date.now()) {
  const startedAtMs = Date.parse(windowStartedAt);
  if (Number.isNaN(startedAtMs)) {
    return true;
  }

  return now - startedAtMs >= 24 * 60 * 60 * 1000;
}

function normalizeUsageRecord(record: UserStoryUsageRecord | undefined, userId: string): UserStoryUsageRecord {
  const fallback = createDefaultUsage(userId);
  const base = record
  ? {
      userId,
      storiesGenerated: typeof record.storiesGenerated === "number" ? record.storiesGenerated : 0,
      dailyStoriesGenerated: typeof record.dailyStoriesGenerated === "number" ? record.dailyStoriesGenerated : 0,
      dailyWindowStartedAt: typeof record.dailyWindowStartedAt === "string" ? record.dailyWindowStartedAt : record.updatedAt,
      updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : fallback.updatedAt,
      credits: typeof record.credits === "number" ? record.credits : 10 // 👈 ВОТ ЭТО
    }
    : fallback;

  if (isDailyWindowExpired(base.dailyWindowStartedAt)) {
    return {
      ...base,
      dailyStoriesGenerated: 0,
      dailyWindowStartedAt: new Date().toISOString()
    };
  }

  return base;
}

async function readStore(): Promise<UsageStore> {
  return readMutableJsonStore<UsageStore>({
    key: STORE_KEY,
    filePath: STORE_PATH,
    defaultValue: {}
  });
}

async function writeStore(store: UsageStore) {
  await writeMutableJsonStore({
    key: STORE_KEY,
    filePath: STORE_PATH,
    value: store
  });
}

export async function getUserStoryUsage(userId: string): Promise<UserStoryUsageRecord> {
  const store = await readStore();
  const next = normalizeUsageRecord(store[userId], userId);

  if (JSON.stringify(store[userId] || null) !== JSON.stringify(next)) {
    store[userId] = next;
    await writeStore(store);
  }

  return next;
}

export async function incrementUserStoryUsage(userId: string): Promise<UserStoryUsageRecord> {
  const store = await readStore();
  const current = normalizeUsageRecord(store[userId], userId);
  const next: UserStoryUsageRecord = {
    userId,
    storiesGenerated: current.storiesGenerated + 1,
    dailyStoriesGenerated: current.dailyStoriesGenerated + 1,
    dailyWindowStartedAt: current.dailyWindowStartedAt,
    updatedAt: new Date().toISOString()
  };

  store[userId] = next;
  await writeStore(store);
  return next;
}
export async function decrementUserCredits(userId: string, amount: number): Promise<UserStoryUsageRecord> {
  const store = await readStore();
  const current = normalizeUsageRecord(store[userId], userId);

  const next: UserStoryUsageRecord = {
    ...current,
    credits: Math.max((current.credits || 0) - amount, 0),
    updatedAt: new Date().toISOString()
  };

  store[userId] = next;
  await writeStore(store);

  return next;
}