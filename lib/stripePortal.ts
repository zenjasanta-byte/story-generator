import Stripe from "stripe";
import { getCurrentUserIdentity } from "@/lib/currentUser.server";
import { normalizeLanguageCode } from "@/lib/narrationVoices";
import { normalizeStripeLocale, type StripeLocale } from "@/lib/stripeLocale";
import {
  getBillingRecord,
  shouldKeepPremiumForStatus,
  updatePremiumSubscriptionForUser,
  type BillingInterval,
  type SubscriptionStatus,
  type UserBillingRecord
} from "@/lib/premiumStore";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
const billingPortalConfigurationId = process.env.STRIPE_BILLING_PORTAL_CONFIGURATION_ID;

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2026-02-25.clover"
    })
  : null;

export class PortalRouteError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "PortalRouteError";
    this.status = status;
  }
}

type PortalFlow = "portal" | "subscription_update" | "subscription_cancel";

type PortalContext = {
  stripeClient: Stripe;
  userId: string;
  locale: string;
  stripeLocale: StripeLocale;
  returnUrl: string;
  record: UserBillingRecord;
};

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

function getSubscriptionPriceData(subscription: Stripe.Subscription): {
  stripePriceId: string | null;
  billingInterval: BillingInterval;
} {
  const item = subscription.items.data[0];
  const stripePriceId = item?.price?.id ?? null;
  const interval = item?.price?.recurring?.interval;

  return {
    stripePriceId,
    billingInterval: interval === "month" || interval === "year" ? interval : null
  };
}

function chooseCurrentSubscription(subscriptions: Stripe.Subscription[]) {
  const priority: Record<Stripe.Subscription.Status, number> = {
    active: 3,
    trialing: 2,
    past_due: 1,
    unpaid: 0,
    incomplete: 0,
    incomplete_expired: 0,
    canceled: 0,
    paused: 0
  };

  return (
    subscriptions
      .slice()
      .sort((a, b) => {
        const byPriority = (priority[b.status] || 0) - (priority[a.status] || 0);
        if (byPriority !== 0) return byPriority;
        return (b.created || 0) - (a.created || 0);
      })
      .find(
        (subscription) =>
          subscription.status === "active" || subscription.status === "trialing" || subscription.status === "past_due"
      ) || null
  );
}

async function getPortalContext(localeInput: string): Promise<PortalContext> {
  if (!stripe || !stripeSecretKey || !appUrl) {
    throw new PortalRouteError("Stripe is not configured on the server.", 500);
  }

  const locale = normalizeLanguageCode(String(localeInput || "en"));
  const stripeLocale = normalizeStripeLocale(String(localeInput || locale));
  const identity = await getCurrentUserIdentity();
  const userId = identity.authenticatedAppUserId;

  if (!userId) {
    throw new PortalRouteError("Not authenticated.", 401);
  }

  const record = await getBillingRecord(userId);
  if (!record.stripeCustomerId) {
    throw new PortalRouteError("No Stripe customer found for this user.", 400);
  }

  return {
    stripeClient: stripe,
    userId,
    locale,
    stripeLocale,
    returnUrl: `${appUrl}/${locale}/billing`,
    record
  };
}

async function resolveValidSubscription(
  stripeClient: Stripe,
  record: UserBillingRecord
): Promise<{ record: UserBillingRecord; subscriptionId: string }> {
  const storedSubscriptionId = record.stripeSubscriptionId;
  console.log("[stripe-portal] stored stripeSubscriptionId", {
    userId: record.userId,
    stripeCustomerId: record.stripeCustomerId,
    stripeSubscriptionId: storedSubscriptionId
  });

  if (storedSubscriptionId) {
    try {
      const storedSubscription = await stripeClient.subscriptions.retrieve(storedSubscriptionId);
      const storedCustomerId =
        typeof storedSubscription.customer === "string" ? storedSubscription.customer : storedSubscription.customer?.id ?? null;

      if (storedCustomerId === record.stripeCustomerId) {
        console.log("[stripe-portal] stored subscription is valid", {
          stripeSubscriptionId: storedSubscription.id,
          status: storedSubscription.status
        });

        const status = toSubscriptionStatus(storedSubscription.status);
        const priceData = getSubscriptionPriceData(storedSubscription);
        const updatedRecord = await updatePremiumSubscriptionForUser({
          userId: record.userId,
          subscriptionStatus: status,
          stripeCustomerId: record.stripeCustomerId,
          stripeSubscriptionId: storedSubscription.id,
          stripePriceId: priceData.stripePriceId,
          billingInterval: priceData.billingInterval
        });

        return {
          record: updatedRecord,
          subscriptionId: storedSubscription.id
        };
      }

      console.log("[stripe-portal] stored subscription belongs to different customer", {
        storedSubscriptionId,
        storedCustomerId,
        expectedCustomerId: record.stripeCustomerId
      });
    } catch (error: unknown) {
      const stripeError = error as { code?: string; message?: string };
      console.log("[stripe-portal] stored subscription retrieve failed", {
        storedSubscriptionId,
        code: stripeError?.code || null,
        message: stripeError?.message || String(error)
      });
    }
  }

  const customerSubscriptions = await stripeClient.subscriptions.list({
    customer: record.stripeCustomerId!,
    status: "all",
    limit: 20
  });

  console.log("[stripe-portal] customer subscriptions found in Stripe", {
    stripeCustomerId: record.stripeCustomerId,
    subscriptions: customerSubscriptions.data.map((subscription) => ({
      id: subscription.id,
      status: subscription.status
    }))
  });

  const currentSubscription = chooseCurrentSubscription(customerSubscriptions.data);
  if (!currentSubscription) {
    throw new PortalRouteError("No active Stripe subscription found for this customer.", 400);
  }

  const status = toSubscriptionStatus(currentSubscription.status);
  const priceData = getSubscriptionPriceData(currentSubscription);
  const updatedRecord = await updatePremiumSubscriptionForUser({
    userId: record.userId,
    subscriptionStatus: status,
    stripeCustomerId: record.stripeCustomerId,
    stripeSubscriptionId: currentSubscription.id,
    stripePriceId: priceData.stripePriceId,
    billingInterval: priceData.billingInterval
  });

  console.log("[stripe-portal] recovered subscription ID", {
    userId: record.userId,
    finalSubscriptionId: currentSubscription.id,
    status: currentSubscription.status
  });

  return {
    record: updatedRecord,
    subscriptionId: currentSubscription.id
  };
}

async function buildFlowData(
  stripeClient: Stripe,
  flow: PortalFlow,
  record: UserBillingRecord,
  returnUrl: string
): Promise<{ flowData?: Stripe.BillingPortal.SessionCreateParams.FlowData; record: UserBillingRecord }> {
  if (flow === "portal") {
    return { record };
  }

  const resolved = await resolveValidSubscription(stripeClient, record);

  if (flow === "subscription_update") {
    return {
      record: resolved.record,
      flowData: {
        type: "subscription_update",
        after_completion: {
          type: "redirect",
          redirect: {
            return_url: returnUrl
          }
        },
        subscription_update: {
          subscription: resolved.subscriptionId
        }
      }
    };
  }

  return {
    record: resolved.record,
    flowData: {
      type: "subscription_cancel",
      after_completion: {
        type: "redirect",
        redirect: {
          return_url: returnUrl
        }
      },
      subscription_cancel: {
        subscription: resolved.subscriptionId
      }
    }
  };
}

export async function createPortalSession(input: { localeInput: string; flow?: PortalFlow }) {
  const flow = input.flow || "portal";
  const context = await getPortalContext(input.localeInput);

  console.log("[stripe-portal] opening portal flow", {
    flow,
    userId: context.userId,
    locale: context.locale,
    plan: context.record.plan,
    subscriptionStatus: context.record.subscriptionStatus,
    stripeCustomerId: context.record.stripeCustomerId,
    stripeSubscriptionId: context.record.stripeSubscriptionId,
    stripePriceId: context.record.stripePriceId,
    billingInterval: context.record.billingInterval,
    stripeLocale: context.stripeLocale,
    hasPortalConfiguration: Boolean(billingPortalConfigurationId)
  });

  if (!context.record.stripeSubscriptionId) {
    console.log("[stripe-portal] warning: user has no stripeSubscriptionId stored", {
      userId: context.userId,
      stripeCustomerId: context.record.stripeCustomerId
    });
  }

  if (!shouldKeepPremiumForStatus(context.record.subscriptionStatus) && context.record.plan !== "premium") {
    console.log("[stripe-portal] warning: portal opened for user without active premium status", {
      userId: context.userId,
      plan: context.record.plan,
      subscriptionStatus: context.record.subscriptionStatus
    });
  }

  const flowResult = await buildFlowData(context.stripeClient, flow, context.record, context.returnUrl);
  const params: Stripe.BillingPortal.SessionCreateParams = {
    customer: flowResult.record.stripeCustomerId!,
    return_url: context.returnUrl,
    locale: context.stripeLocale,
    ...(billingPortalConfigurationId ? { configuration: billingPortalConfigurationId } : {}),
    ...(flowResult.flowData ? { flow_data: flowResult.flowData } : {})
  };

  const session = await context.stripeClient.billingPortal.sessions.create(params);

  if (!session.url) {
    throw new PortalRouteError("Stripe Customer Portal URL was not created.", 500);
  }

  console.log("[stripe-portal] portal session created", {
    flow,
    userId: context.userId,
    portalSessionId: session.id,
    returnUrl: context.returnUrl,
    usedSubscriptionId: flowResult.record.stripeSubscriptionId
  });

  return {
    url: session.url,
    returnUrl: context.returnUrl,
    userId: context.userId,
    flow
  };
}
