"use client";

export function SignOutButton({
  label,
  redirectTo,
  className
}: {
  label: string;
  redirectTo: string;
  className?: string;
}) {
  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });

    window.location.href = redirectTo;
  }

  return (
    <button type="button" onClick={() => void handleLogout()} className={className}>
      {label}
    </button>
  );
}
