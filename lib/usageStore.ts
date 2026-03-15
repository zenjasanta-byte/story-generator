import { promises as fs } from "fs";
import path from "path";

export type UserStoryUsageRecord = {
  userId: string;
  storiesGenerated: number;
  dailyStoriesGenerated: number;
  dailyWindowStartedAt: string;
  updatedAt: string;
};

type UsageStore = Record<string, UserStoryUsageRecord>;

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "story-usage.json");

function createDefaultUsage(userId: string): UserStoryUsageRecord {
  const now = new Date().toISOString();
  return {
    userId,
    storiesGenerated: 0,
    dailyStoriesGenerated: 0,
    dailyWindowStartedAt: now,
    updatedAt: now
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
        updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : fallback.updatedAt
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

async function ensureStoreFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(STORE_PATH);
  } catch {
    await fs.writeFile(STORE_PATH, JSON.stringify({}, null, 2), "utf8");
  }
}

async function readStore(): Promise<UsageStore> {
  await ensureStoreFile();
  const raw = await fs.readFile(STORE_PATH, "utf8");

  try {
    return JSON.parse(raw) as UsageStore;
  } catch {
    return {};
  }
}

async function writeStore(store: UsageStore) {
  await ensureStoreFile();
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
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
