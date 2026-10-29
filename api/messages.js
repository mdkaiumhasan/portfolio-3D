import crypto from 'crypto';
import { connectToDatabase } from './_db.js';
import { verifyAdminRequest } from './_auth.js';

const COLLECTION = 'contact_messages';

function trimField(val, maxLen) {
  return String(val || '').trim().slice(0, maxLen);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // PUBLIC POST: Visitor submits contact form from 2D or 3D portfolio
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

      // Honeypot check against automated spam bots
      if (body.website && String(body.website).trim().length > 0) {
        return res.status(200).json({ success: true, message: 'Message received' });
      }

      const fromName = trimField(body.fromName || body.name, 120);
      const fromEmail = trimField(body.fromEmail || body.email, 160);
      const subject = trimField(body.subject || 'Portfolio Contact Inquiry', 200);
      const messageBody = trimField(body.body || body.message, 5000);
      const source = body.source === '2d' ? '2d' : '3d';

      if (!fromName || !fromEmail || !messageBody) {
        return res.status(400).json({
          success: false,
          error: 'Name, email, and message are required.'
        });
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromEmail)) {
        return res.status(400).json({
          success: false,
          error: 'Please enter a valid email address.'
        });
      }

      const { db } = await connectToDatabase();
      const doc = {
        id: crypto.randomUUID(),
        fromName,
        fromEmail,
        subject,
        body: messageBody,
        source,
        read: false,
        date: new Date().toISOString()
      };

      await db.collection(COLLECTION).insertOne(doc);

      return res.status(201).json({
        success: true,
        id: doc.id,
        message: 'Message delivered successfully'
      });
    } catch (error) {
      console.error('Contact message POST error:', error);
      return res.status(500).json({
        success: false,
        error: 'Unable to store message right now. Please use direct email fallback.'
      });
    }
  }

  // All remaining methods require Admin authentication
  const authCheck = verifyAdminRequest(req);
  if (!authCheck.authorized) {
    return res.status(authCheck.status).json({ success: false, error: authCheck.error });
  }

  try {
    const { db } = await connectToDatabase();
    const col = db.collection(COLLECTION);

    // GET: List all inbox messages newest-first
    if (req.method === 'GET') {
      const items = await col
        .find({}, { projection: { _id: 0 } })
        .sort({ date: -1 })
        .limit(200)
        .toArray();

      return res.status(200).json({ success: true, messages: items });
    }

    // PATCH: Toggle read/unread status
    if (req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { id, read, markAllRead } = body;

      if (markAllRead) {
        await col.updateMany({ read: false }, { $set: { read: true } });
        return res.status(200).json({ success: true });
      }

      if (!id) {
        return res.status(400).json({ success: false, error: 'Message id is required' });
      }

      await col.updateOne({ id: String(id) }, { $set: { read: Boolean(read) } });
      return res.status(200).json({ success: true });
    }

    // DELETE: Remove single message or all read messages
    if (req.method === 'DELETE') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const urlObj = new URL(req.url || '/api/messages', 'http://localhost');
      const id = body.id || urlObj.searchParams.get('id');

      if (body.clearRead) {
        await col.deleteMany({ read: true });
        return res.status(200).json({ success: true });
      }

      if (!id) {
        return res.status(400).json({ success: false, error: 'Message id is required' });
      }

      await col.deleteOne({ id: String(id) });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Inbox API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Database error while accessing inbox'
    });
  }
}

