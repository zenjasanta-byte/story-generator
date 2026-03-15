import { NextResponse } from "next/server";
import { getCurrentUserIdentity } from "@/lib/currentUser.server";
import { isPremiumVoiceStyle } from "@/lib/narrationVoices";
import { getBillingRecord, shouldKeepPremiumForStatus, type UserBillingRecord } from "@/lib/premiumStore";
import type { VoiceStyle } from "@/types/story";

type GuardSuccess = {
  ok: true;
  userId: string;
  billing: UserBillingRecord;
  isPremium: boolean;
};

type GuardFailure = {
  ok: false;
  response: NextResponse;
};

export type PremiumGuardResult = GuardSuccess | GuardFailure;

function buildPremiumRequiredResponse() {
  return NextResponse.json(
    {
      error: "Premium subscription required",
      upgradeRequired: true
    },
    { status: 403 }
  );
}

export async function requireAuthenticatedUser(feature: string): Promise<PremiumGuardResult> {
  const identity = await getCurrentUserIdentity();
  const userId = identity.authenticatedAppUserId;

  if (!userId) {
    console.warn("[premium-guard] blocked unauthenticated request", { feature });
    return {
      ok: false,
      response: NextResponse.json({ error: "Authentication required" }, { status: 401 })
    };
  }

  const billing = await getBillingRecord(userId);
  const isPremium = billing.plan === "premium" && shouldKeepPremiumForStatus(billing.subscriptionStatus);

  return {
    ok: true,
    userId,
    billing,
    isPremium
  };
}

export async function requirePremiumAccess(feature: string): Promise<PremiumGuardResult> {
  const result = await requireAuthenticatedUser(feature);
  if (!result.ok) {
    return result;
  }

  if (!result.isPremium) {
    console.warn("[premium-guard] blocked premium feature", {
      userId: result.userId,
      feature,
      plan: result.billing.plan,
      subscriptionStatus: result.billing.subscriptionStatus
    });

    return {
      ok: false,
      response: buildPremiumRequiredResponse()
    };
  }

  return result;
}

export function canUsePremiumVoice(billing: UserBillingRecord, voiceStyle?: VoiceStyle): boolean {
  if (!voiceStyle || !isPremiumVoiceStyle(voiceStyle)) {
    return true;
  }

  return billing.plan === "premium" && shouldKeepPremiumForStatus(billing.subscriptionStatus);
}

export function canExportPdf(billing: UserBillingRecord): boolean {
  return billing.plan === "premium" && shouldKeepPremiumForStatus(billing.subscriptionStatus);
}

export function canExportZip(billing: UserBillingRecord): boolean {
  return billing.plan === "premium" && shouldKeepPremiumForStatus(billing.subscriptionStatus);
}

export function canDownloadAudio(billing: UserBillingRecord): boolean {
  return billing.plan === "premium" && shouldKeepPremiumForStatus(billing.subscriptionStatus);
}
