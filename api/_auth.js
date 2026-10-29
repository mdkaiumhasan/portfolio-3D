import crypto from 'crypto';

const TOKEN_PREFIX = 'agy_admin_v1';
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getSigningSecret() {
  const secret = process.env.JWT_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret || secret.trim().length === 0) {
    return null;
  }
  return secret;
}

export function isAuthConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.trim().length > 0);
}

export function verifyAdminPassword(candidatePassword) {
  const validPassword = process.env.ADMIN_PASSWORD;
  if (!validPassword || typeof candidatePassword !== 'string') {
    return false;
  }

  const a = Buffer.from(candidatePassword, 'utf8');
  const b = Buffer.from(validPassword, 'utf8');
  if (a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

export function createAdminToken() {
  const secret = getSigningSecret();
  if (!secret) {
    throw new Error('ADMIN_PASSWORD or JWT_SECRET environment variable is not configured');
  }

  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const payload = `${TOKEN_PREFIX}.${expiresAt}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return `${payload}.${signature}`;
}

export function verifyAdminToken(token) {
  const secret = getSigningSecret();
  if (!secret || typeof token !== 'string') {
    return false;
  }

  const parts = token.trim().split('.');
  if (parts.length !== 3 || parts[0] !== TOKEN_PREFIX) {
    return false;
  }

  const expiresAt = Number(parts[1]);
  const providedSig = parts[2];
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt || !providedSig) {
    return false;
  }

  const expectedPayload = `${TOKEN_PREFIX}.${expiresAt}`;
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(expectedPayload)
    .digest('hex');

  const sigBufA = Buffer.from(providedSig, 'utf8');
  const sigBufB = Buffer.from(expectedSig, 'utf8');
  if (sigBufA.length !== sigBufB.length) {
    return false;
  }

  return crypto.timingSafeEqual(sigBufA, sigBufB);
}

export function verifyAdminRequest(req) {
  if (!isAuthConfigured()) {
    return {
      authorized: false,
      status: 503,
      error: 'Server authentication is not configured. Please set ADMIN_PASSWORD in environment variables.'
    };
  }

  const authHeader = req.headers?.authorization || req.headers?.Authorization || '';
  const token = String(authHeader).replace(/^Bearer\s+/i, '').trim();

  if (!token) {
    return {
      authorized: false,
      status: 401,
      error: 'Unauthorized: Missing admin session token'
    };
  }

  if (!verifyAdminToken(token)) {
    return {
      authorized: false,
      status: 401,
      error: 'Unauthorized: Session expired or invalid. Please sign in again.'
    };
  }

  return { authorized: true, status: 200 };
}

