import { readMutableJsonStore, resolveDataFile, writeMutableJsonStore } from "@/lib/mutableJsonStore";

export type AuthIdentityLinkRecord = {
  authUserId: string;
  appUserId: string;
  guestUserId: string | null;
  linkedAt: string;
  updatedAt: string;
};

type AuthIdentityStore = Record<string, AuthIdentityLinkRecord>;

const STORE_KEY = "auth-identity-links";
const STORE_PATH = resolveDataFile("auth-identity-links.json");

async function readStore(): Promise<AuthIdentityStore> {
  return readMutableJsonStore<AuthIdentityStore>({
    key: STORE_KEY,
    filePath: STORE_PATH,
    defaultValue: {}
  });
}

async function writeStore(store: AuthIdentityStore) {
  await writeMutableJsonStore({
    key: STORE_KEY,
    filePath: STORE_PATH,
    value: store
  });
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
