type RateLimitEntry = {
  hits: number[];
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) {
      return firstIp;
    }
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }

  return "unknown";
}

export function takeIpRateLimit(params: {
  ip: string;
  maxRequests: number;
  windowMs: number;
}): RateLimitResult {
  const now = Date.now();
  const windowStart = now - params.windowMs;
  const current = rateLimitStore.get(params.ip);
  const hits = (current?.hits ?? []).filter((timestamp) => timestamp > windowStart);

  if (hits.length >= params.maxRequests) {
    const oldestHit = hits[0] ?? now;
    const retryAfterSeconds = Math.max(Math.ceil((oldestHit + params.windowMs - now) / 1000), 1);

    rateLimitStore.set(params.ip, { hits });
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds
    };
  }

  hits.push(now);
  rateLimitStore.set(params.ip, { hits });

  return {
    allowed: true,
    remaining: Math.max(params.maxRequests - hits.length, 0),
    retryAfterSeconds: 0
  };
}
