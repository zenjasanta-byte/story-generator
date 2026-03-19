import { NextResponse } from "next/server";
import { getCurrentUserIdentity } from "@/lib/currentUser.server";
import { getUserStoryUsage } from "@/lib/usageStore";

export async function GET() {
  const identity = await getCurrentUserIdentity();

  const userId = identity.authenticatedAppUserId
    ? `user:${identity.authenticatedAppUserId}`
    : `guest:${identity.appUserId}`;

  const usage = await getUserStoryUsage(userId);

  return NextResponse.json({
    credits: usage.credits || 0
  });
}
