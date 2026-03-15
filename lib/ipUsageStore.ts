import { promises as fs } from "fs";
import path from "path";

export type IpStoryUsageRecord = {
  ip: string;
  storiesGenerated: number;
  dailyWindowStartedAt: string;
  updatedAt: string;
};

type IpUsageStore = Record<string, IpStoryUsageRecord>;

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "ip-story-usage.json");

function createDefaultUsage(ip: string): IpStoryUsageRecord {
  const now = new Date().toISOString();
  return {
    ip,
    storiesGenerated: 0,
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

function normalizeUsageRecord(record: IpStoryUsageRecord | undefined, ip: string): IpStoryUsageRecord {
  const fallback = createDefaultUsage(ip);
  const base = record
    ? {
        ip,
        storiesGenerated: typeof record.storiesGenerated === "number" ? record.storiesGenerated : 0,
        dailyWindowStartedAt: typeof record.dailyWindowStartedAt === "string" ? record.dailyWindowStartedAt : record.updatedAt,
        updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : fallback.updatedAt
      }
    : fallback;

  if (isDailyWindowExpired(base.dailyWindowStartedAt)) {
    return {
      ...base,
      storiesGenerated: 0,
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

async function readStore(): Promise<IpUsageStore> {
  await ensureStoreFile();
  const raw = await fs.readFile(STORE_PATH, "utf8");

  try {
    return JSON.parse(raw) as IpUsageStore;
  } catch {
    return {};
  }
}

async function writeStore(store: IpUsageStore) {
  await ensureStoreFile();
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function getIpStoryUsage(ip: string): Promise<IpStoryUsageRecord> {
  const store = await readStore();
  const next = normalizeUsageRecord(store[ip], ip);

  if (JSON.stringify(store[ip] || null) !== JSON.stringify(next)) {
    store[ip] = next;
    await writeStore(store);
  }

  return next;
}

export async function incrementIpStoryUsage(ip: string): Promise<IpStoryUsageRecord> {
  const store = await readStore();
  const current = normalizeUsageRecord(store[ip], ip);
  const next: IpStoryUsageRecord = {
    ip,
    storiesGenerated: current.storiesGenerated + 1,
    dailyWindowStartedAt: current.dailyWindowStartedAt,
    updatedAt: new Date().toISOString()
  };

  store[ip] = next;
  await writeStore(store);
  return next;
}
