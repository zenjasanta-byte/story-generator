import { promises as fs } from "fs";
import path from "path";

export type AuthIdentityLinkRecord = {
  authUserId: string;
  appUserId: string;
  guestUserId: string | null;
  linkedAt: string;
  updatedAt: string;
};

type AuthIdentityStore = Record<string, AuthIdentityLinkRecord>;

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "auth-identity-links.json");

async function ensureStoreFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(STORE_PATH);
  } catch {
    await fs.writeFile(STORE_PATH, JSON.stringify({}, null, 2), "utf8");
  }
}

async function readStore(): Promise<AuthIdentityStore> {
  await ensureStoreFile();
  const raw = await fs.readFile(STORE_PATH, "utf8");

  try {
    return JSON.parse(raw) as AuthIdentityStore;
  } catch {
    return {};
  }
}

async function writeStore(store: AuthIdentityStore) {
  await ensureStoreFile();
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function getAuthIdentityLink(authUserId: string): Promise<AuthIdentityLinkRecord | null> {
  const store = await readStore();
  return store[authUserId] ?? null;
}

export async function linkAuthUserToAppIdentity(input: {
  authUserId: string;
  appUserId: string;
  guestUserId?: string | null;
}) {
  const store = await readStore();
  const existing = store[input.authUserId] ?? null;
  const now = new Date().toISOString();

  const next: AuthIdentityLinkRecord = {
    authUserId: input.authUserId,
    appUserId: input.appUserId,
    guestUserId: input.guestUserId ?? existing?.guestUserId ?? null,
    linkedAt: existing?.linkedAt ?? now,
    updatedAt: now
  };

  store[input.authUserId] = next;
  await writeStore(store);
  return next;
}
