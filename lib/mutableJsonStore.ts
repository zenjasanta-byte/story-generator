import { promises as fs } from "fs";
import path from "path";

type RedisConfig = {
  url: string;
  token: string;
};

function getRedisConfig(): RedisConfig | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.VERCEL_KV_REST_API_URL || null;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env.VERCEL_KV_REST_API_TOKEN || null;

  if (!url || !token) {
    return null;
  }

  return { url, token };
}

function useRedisStore() {
  return process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
}

function getRedisKey(key: string) {
  return `story-generator:${key}`;
}

async function redisGet(key: string): Promise<string | null> {
  const config = getRedisConfig();
  if (!config) {
    throw new Error("Redis is not configured");
  }

  const response = await fetch(`${config.url}/get/${encodeURIComponent(getRedisKey(key))}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${config.token}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Redis GET failed with status ${response.status}`);
  }

  const payload = (await response.json()) as { result?: string | null };
  return payload.result ?? null;
}

async function redisSet(key: string, value: string) {
  const config = getRedisConfig();
  if (!config) {
    throw new Error("Redis is not configured");
  }

  const response = await fetch(`${config.url}/set/${encodeURIComponent(getRedisKey(key))}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(value),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Redis SET failed with status ${response.status}`);
  }
}

export function resolveDataFile(filename: string) {
  return path.join(process.cwd(), "data", filename);
}

export async function readMutableJsonStore<T>(params: {
  key: string;
  filePath: string;
  defaultValue: T;
}): Promise<T> {
  if (useRedisStore()) {
    const config = getRedisConfig();
    if (!config) {
      throw new Error("Production mutable storage is not configured. Set KV/Upstash Redis REST env vars.");
    }

    try {
      const raw = await redisGet(params.key);
      if (!raw) {
        return params.defaultValue;
      }

      return JSON.parse(raw) as T;
    } catch (error) {
      console.error("[mutable-json-store] redis read failed", {
        key: params.key,
        error
      });
      throw error;
    }
  }

  await fs.mkdir(path.dirname(params.filePath), { recursive: true });

  try {
    await fs.access(params.filePath);
  } catch {
    await fs.writeFile(params.filePath, JSON.stringify(params.defaultValue, null, 2), "utf8");
    return params.defaultValue;
  }

  try {
    const raw = await fs.readFile(params.filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return params.defaultValue;
  }
}

export async function writeMutableJsonStore<T>(params: {
  key: string;
  filePath: string;
  value: T;
}) {
  const serialized = JSON.stringify(params.value, null, 2);

  if (useRedisStore()) {
    const config = getRedisConfig();
    if (!config) {
      throw new Error("Production mutable storage is not configured. Set KV/Upstash Redis REST env vars.");
    }

    try {
      await redisSet(params.key, serialized);
      return;
    } catch (error) {
      console.error("[mutable-json-store] redis write failed", {
        key: params.key,
        error
      });
      throw error;
    }
  }

  await fs.mkdir(path.dirname(params.filePath), { recursive: true });
  await fs.writeFile(params.filePath, serialized, "utf8");
}
