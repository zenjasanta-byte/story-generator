import { randomBytes, randomUUID, scrypt as nodeScrypt, timingSafeEqual } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { promisify } from "util";

const scrypt = promisify(nodeScrypt);

export type AuthUserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
  updatedAt: string;
};

type AuthStore = {
  usersById: Record<string, AuthUserRecord>;
  userIdsByEmail: Record<string, string>;
};

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "auth-users.json");

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function ensureStoreFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(STORE_PATH);
  } catch {
    await fs.writeFile(STORE_PATH, JSON.stringify({ usersById: {}, userIdsByEmail: {} }, null, 2), "utf8");
  }
}

async function readStore(): Promise<AuthStore> {
  await ensureStoreFile();
  const raw = await fs.readFile(STORE_PATH, "utf8");

  try {
    const parsed = JSON.parse(raw) as Partial<AuthStore>;
    return {
      usersById: parsed.usersById ?? {},
      userIdsByEmail: parsed.userIdsByEmail ?? {}
    };
  } catch {
    return { usersById: {}, userIdsByEmail: {} };
  }
}

async function writeStore(store: AuthStore) {
  await ensureStoreFile();
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

async function hashPassword(password: string, salt: string) {
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return derived.toString("hex");
}

export async function createAuthUser(input: { email: string; password: string }) {
  const email = normalizeEmail(input.email);
  const store = await readStore();

  if (store.userIdsByEmail[email]) {
    return { ok: false as const, reason: "email_taken" as const };
  }

  const now = new Date().toISOString();
  const salt = randomBytes(16).toString("hex");
  const passwordHash = await hashPassword(input.password, salt);
  const user: AuthUserRecord = {
    id: randomUUID(),
    email,
    passwordHash,
    passwordSalt: salt,
    createdAt: now,
    updatedAt: now
  };

  store.usersById[user.id] = user;
  store.userIdsByEmail[email] = user.id;
  await writeStore(store);

  return { ok: true as const, user };
}

export async function getAuthUserByEmail(emailInput: string) {
  const email = normalizeEmail(emailInput);
  const store = await readStore();
  const userId = store.userIdsByEmail[email];
  return userId ? store.usersById[userId] ?? null : null;
}

export async function getAuthUserById(userId: string) {
  const store = await readStore();
  return store.usersById[userId] ?? null;
}

export async function verifyAuthCredentials(input: { email: string; password: string }) {
  const user = await getAuthUserByEmail(input.email);
  if (!user) {
    return null;
  }

  const computedHash = await hashPassword(input.password, user.passwordSalt);
  const a = Buffer.from(computedHash, "hex");
  const b = Buffer.from(user.passwordHash, "hex");

  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return null;
  }

  return user;
}
