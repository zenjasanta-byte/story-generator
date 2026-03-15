export type AuthSessionResponse = {
  isAuthenticated: boolean;
  guestUserId: string | null;
  authenticatedAppUserId?: string | null;
  appUserId?: string | null;
  linkedGuestSession?: boolean;
  user: {
    id: string;
    email: string;
  } | null;
};

export async function fetchAuthSession(): Promise<AuthSessionResponse> {
  const response = await fetch("/api/auth/session", {
    method: "GET",
    cache: "no-store",
    credentials: "same-origin"
  });

  if (!response.ok) {
    throw new Error("Failed to load auth session.");
  }

  return (await response.json()) as AuthSessionResponse;
}
