export type PremiumPlan = "free" | "premium";
export type SubscriptionStatus =
  | "inactive"
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "incomplete"
  | "incomplete_expired"
  | "paused";
export type BillingInterval = "month" | "year" | null;

export type UserBillingRecord = {
  userId?: string;
  plan: PremiumPlan;
  subscriptionStatus: SubscriptionStatus;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripeCheckoutSessionId?: string | null;
  stripePriceId?: string | null;
  billingInterval?: BillingInterval;
  cancelAtPeriodEnd?: boolean;
  currentPeriodEnd?: string | null;
  updatedAt?: string;
};

export async function getBillingRecord(..._args: unknown[]): Promise<UserBillingRecord> {
  return {
    plan: "free",
    subscriptionStatus: "inactive",
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    stripeCheckoutSessionId: null,
    stripePriceId: null,
    billingInterval: null,
    cancelAtPeriodEnd: false,
    currentPeriodEnd: null,
    updatedAt: new Date().toISOString()
  };
}

export function shouldKeepPremiumForStatus(..._args: unknown[]) {
  return false;
}
