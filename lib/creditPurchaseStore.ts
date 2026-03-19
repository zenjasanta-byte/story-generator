import { readMutableJsonStore, resolveDataFile, writeMutableJsonStore } from "@/lib/mutableJsonStore";

type CreditPurchaseRecord = {
  sessionId: string;
  userId: string;
  credits: number;
  processedAt: string;
};

type CreditPurchaseStore = Record<string, CreditPurchaseRecord>;

const STORE_KEY = "credit-purchases";
const STORE_PATH = resolveDataFile("credit-purchases.json");

async function readStore(): Promise<CreditPurchaseStore> {
  return readMutableJsonStore<CreditPurchaseStore>({
    key: STORE_KEY,
    filePath: STORE_PATH,
    defaultValue: {}
  });
}

async function writeStore(store: CreditPurchaseStore) {
  await writeMutableJsonStore({
    key: STORE_KEY,
    filePath: STORE_PATH,
    value: store
  });
}

export async function getProcessedCreditPurchase(sessionId: string): Promise<CreditPurchaseRecord | null> {
  const store = await readStore();
  return store[sessionId] ?? null;
}

export async function markCreditPurchaseProcessed(sessionId: string, userId: string, credits: number) {
  const store = await readStore();
  store[sessionId] = {
    sessionId,
    userId,
    credits,
    processedAt: new Date().toISOString()
  };
  await writeStore(store);
}
