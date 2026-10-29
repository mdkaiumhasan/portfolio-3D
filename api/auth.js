import {
  isAuthConfigured,
  verifyAdminPassword,
  createAdminToken,
  verifyAdminRequest
} from './_auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Verify active session token
  if (req.method === 'GET') {
    const check = verifyAdminRequest(req);
    if (!check.authorized) {
      return res.status(check.status).json({ success: false, error: check.error });
    }
    return res.status(200).json({ success: true, valid: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  if (!isAuthConfigured()) {
    return res.status(503).json({
      success: false,
      error: 'ADMIN_PASSWORD is not configured on the server. Add it to .env.local or Vercel Environment Variables.'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { password } = body;

    if (verifyAdminPassword(password)) {
      const token = createAdminToken();
      return res.status(200).json({
        success: true,
        token,
        message: 'Authentication successful'
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid password'
    });
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
