import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import {
  activatePremiumForUser,
  deactivatePremiumForUser,
  findUserByStripeCustomerId,
  findUserByStripeSubscriptionId,
  shouldKeepPremiumForStatus,
  updatePremiumSubscriptionForUser,
  type BillingInterval,
  type SubscriptionStatus,
  type UserBillingRecord
} from "@/lib/premiumStore";

export const runtime = "nodejs";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2026-02-25.clover"
    })
  : null;

function extractPriceDetails(subscription: Stripe.Subscription): { stripePriceId: string | null; billingInterval: BillingInterval } {
  const item = subscription.items.data[0];
  const stripePriceId = item?.price?.id ?? null;
  const interval = item?.price?.recurring?.interval;

  return {
    stripePriceId,
    billingInterval: interval === "month" || interval === "year" ? interval : null
  };
}

function getCurrentPeriodEnd(subscription: Stripe.Subscription): string | null {
  const periodEndUnix = subscription.items.data[0]?.current_period_end ?? null;
  return periodEndUnix ? new Date(periodEndUnix * 1000).toISOString() : null;
}

function toSubscriptionStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  if (status === "active") return "active";
  if (status === "trialing") return "trialing";
  if (status === "past_due") return "past_due";
  if (status === "canceled") return "canceled";
  if (status === "unpaid") return "unpaid";
  if (status === "incomplete") return "incomplete";
  if (status === "incomplete_expired") return "incomplete_expired";
  if (status === "paused") return "paused";
  return "inactive";
}

async function findUserForSubscriptionEvent(subscription: Stripe.Subscription): Promise<UserBillingRecord | null> {
  const subscriptionId = subscription.id;
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id ?? null;

  if (subscriptionId) {
    const bySubscription = await findUserByStripeSubscriptionId(subscriptionId);
    if (bySubscription) {
      return bySubscription;
    }
  }

  if (customerId) {
    const byCustomer = await findUserByStripeCustomerId(customerId);
    if (byCustomer) {
      return byCustomer;
    }
  }

  return null;
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("[stripe-webhook] checkout.session.completed", {
    sessionId: session.id,
    metadata: session.metadata,
    clientReferenceId: session.client_reference_id
  });

  const userId = session.metadata?.userId || session.client_reference_id;
  if (!userId) {
    console.error("[stripe-webhook] Missing userId on checkout.session.completed", { sessionId: session.id });
    throw new Error("Missing userId in session metadata.");
  }

  const stripeCustomerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
  const stripeSubscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id ?? null;

  await activatePremiumForUser({
    userId,
    stripeCustomerId,
    stripeSubscriptionId,
    stripeCheckoutSessionId: session.id,
    subscriptionStatus: "active"
  });

  console.log("[stripe-webhook] Premium activated for user", { userId, stripeCustomerId, stripeSubscriptionId });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const record = await findUserForSubscriptionEvent(subscription);
  const status = toSubscriptionStatus(subscription.status);
  const stripeCustomerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id ?? null;
  const { stripePriceId, billingInterval } = extractPriceDetails(subscription);
  const currentPeriodEnd = getCurrentPeriodEnd(subscription);

  console.log("[stripe-webhook] customer.subscription.updated", {
    subscriptionId: subscription.id,
    customerId: stripeCustomerId,
    status,
    stripePriceId,
    billingInterval
  });

  if (!record) {
    console.error("[stripe-webhook] No user found for subscription update", {
      subscriptionId: subscription.id,
      customerId: stripeCustomerId
    });
    return;
  }

  await updatePremiumSubscriptionForUser({
    userId: record.userId,
    subscriptionStatus: status,
    stripeCustomerId,
    stripeSubscriptionId: subscription.id,
    stripePriceId,
    billingInterval,
    cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
    currentPeriodEnd
  });

  console.log("[stripe-webhook] Subscription updated for user", {
    userId: record.userId,
    premiumEnabled: shouldKeepPremiumForStatus(status),
    status
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const record = await findUserForSubscriptionEvent(subscription);
  const stripeCustomerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id ?? null;

  console.log("[stripe-webhook] customer.subscription.deleted", {
    subscriptionId: subscription.id,
    customerId: stripeCustomerId,
    status: subscription.status
  });

  if (!record) {
    console.error("[stripe-webhook] No user found for subscription deletion", {
      subscriptionId: subscription.id,
      customerId: stripeCustomerId
    });
    return;
  }

  await deactivatePremiumForUser({
    userId: record.userId,
    subscriptionStatus: "canceled",
    clearStripeSubscriptionId: true,
    cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
    currentPeriodEnd: getCurrentPeriodEnd(subscription)
  });

  console.log("[stripe-webhook] Premium revoked for user", {
    userId: record.userId,
    subscriptionId: subscription.id
  });
}

export async function POST(request: Request) {
  try {
    console.log("[stripe-webhook] request received");

    if (!stripe || !webhookSecret) {
      console.log("[stripe-webhook] Stripe webhook is not configured");
      return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 500 });
    }

    const body = await request.text();
    const headerList = await headers();
    const signature = headerList.get("stripe-signature");

    if (!signature) {
      console.log("[stripe-webhook] Missing Stripe signature");
      return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log("[stripe-webhook] Event type:", event.type);

    if (event.type === "checkout.session.completed") {
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
    }

    if (event.type === "customer.subscription.updated") {
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
    }

    if (event.type === "customer.subscription.deleted") {
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[stripe-webhook] failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook handling failed." },
      { status: 400 }
    );
  }
}
