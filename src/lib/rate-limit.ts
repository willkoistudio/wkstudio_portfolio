/** @format */

// Simple in-memory rate limiter
// In production, consider using Redis or a database

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export function rateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 15 * 60 * 1000, // 15 minutes
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  // Clean up old entries
  if (entry && entry.resetTime < now) {
    rateLimitMap.delete(identifier);
  }

  const currentEntry = rateLimitMap.get(identifier);

  if (!currentEntry) {
    // First request
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs,
    };
  }

  if (currentEntry.count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: currentEntry.resetTime,
    };
  }

  // Increment count
  currentEntry.count++;
  rateLimitMap.set(identifier, currentEntry);

  return {
    success: true,
    remaining: maxRequests - currentEntry.count,
    resetTime: currentEntry.resetTime,
  };
}

// Clean up old entries periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
      if (entry.resetTime < now) {
        rateLimitMap.delete(key);
      }
    }
  }, 60 * 1000); // Clean up every minute
}
