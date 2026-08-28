/**
 * Minimal JWT (HS256) implementation — no external deps, Node crypto only.
 * Used by the admin dashboard login (per skill: ADMIN_PASSWORD + JWT_SECRET).
 */
import crypto from 'crypto';

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

export function sign(payload: object, expiresInSec = 12 * 3600): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + expiresInSec };
  const data = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(body))}`;
  const sig = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

export function verify(token: string): { ok: boolean; payload?: any; error?: string } {
  const parts = token.split('.');
  if (parts.length !== 3) return { ok: false, error: 'malformed' };
  const data = `${parts[0]}.${parts[1]}`;
  const expected = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts[2]))) {
    return { ok: false, error: 'bad signature' };
  }
  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return { ok: false, error: 'expired' };
    return { ok: true, payload };
  } catch {
    return { ok: false, error: 'invalid payload' };
  }
}

export function checkPassword(password: string): boolean {
  if (typeof password !== 'string') return false;
  const a = Buffer.from(password);
  const b = Buffer.from(ADMIN_PASSWORD);
  if (a.length !== b.length) return false; // timingSafeEqual throws on length mismatch
  return crypto.timingSafeEqual(a, b);
}
