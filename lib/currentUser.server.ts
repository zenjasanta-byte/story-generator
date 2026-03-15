import { cookies } from "next/headers";
import { getAuthIdentityLink } from "@/lib/authIdentityStore";
import { getAuthenticatedUser } from "@/lib/authSession.server";
import { USER_ID_COOKIE } from "@/lib/premiumAccess";

export async function getCurrentUserIdentity() {
  const cookieStore = await cookies();
  const guestUserId = cookieStore.get(USER_ID_COOKIE)?.value ?? null;
  const authenticatedUser = await getAuthenticatedUser();
  const link = authenticatedUser ? await getAuthIdentityLink(authenticatedUser.id) : null;
  const authenticatedAppUserId = authenticatedUser ? link?.appUserId ?? authenticatedUser.id : null;
  const appUserId = authenticatedAppUserId ?? guestUserId;

  return {
    guestUserId,
    authenticatedUser,
    linkedAppUserId: link?.appUserId ?? null,
    authenticatedAppUserId,
    appUserId,
    isAuthenticated: Boolean(authenticatedUser),
    linkedGuestSession: Boolean(link?.guestUserId)
  };
}
