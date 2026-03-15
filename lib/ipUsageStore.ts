import { readMutableJsonStore, resolveDataFile, writeMutableJsonStore } from "@/lib/mutableJsonStore";

export type IpStoryUsageRecord = {
  ip: string;
  storiesGenerated: number;
  dailyWindowStartedAt: string;
  updatedAt: string;
};

type IpUsageStore = Record<string, IpStoryUsageRecord>;

const STORE_KEY = "ip-story-usage";
const STORE_PATH = resolveDataFile("ip-story-usage.json");

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

async function readStore(): Promise<IpUsageStore> {
  return readMutableJsonStore<IpUsageStore>({
    key: STORE_KEY,
    filePath: STORE_PATH,
    defaultValue: {}
  });
}

async function writeStore(store: IpUsageStore) {
  await writeMutableJsonStore({
    key: STORE_KEY,
    filePath: STORE_PATH,
    value: store
  });
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
