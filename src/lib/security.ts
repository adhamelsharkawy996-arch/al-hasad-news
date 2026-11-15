import { createHash, randomBytes, timingSafeEqual } from 'crypto';

// Rate limiting store (in-memory, resets on restart)
const rateLimitStore = new Map<string, { attempts: number; resetAt: number }>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(identifier: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(identifier, { attempts: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.attempts++;
  return { allowed: true };
}

export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

// Generate CSRF token
export function generateCsrfToken(): string {
  return randomBytes(32).toString('hex');
}

// Validate CSRF token using timing-safe comparison
export function validateCsrfToken(token: string, expected: string): boolean {
  if (!token || !expected || token.length !== expected.length) {
    return false;
  }
  const tokenBuf = Buffer.from(token);
  const expectedBuf = Buffer.from(expected);
  return timingSafeEqual(tokenBuf, expectedBuf);
}

// Hash password with salt
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256').update(password + salt).digest('hex');
  return `${salt}:${hash}`;
}

// Verify password
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const computed = createHash('sha256').update(password + salt).digest('hex');
  const hashBuf = Buffer.from(hash);
  const computedBuf = Buffer.from(computed);
  if (hashBuf.length !== computedBuf.length) return false;
  return timingSafeEqual(hashBuf, computedBuf);
}
