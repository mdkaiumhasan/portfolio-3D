import { connectToDatabase } from './_db.js';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Fetch portfolio data
  if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase();
      const content = await db.collection('portfolio_content').findOne({ _id: 'main' });

      if (content) {
        delete content._id;
        return res.status(200).json(content);
      }
    } catch (err) {
      console.warn('MongoDB fetch error, falling back to local clean_data.json:', err.message);
    }

    // Fallback to local clean data
    try {
      const localDataPath = path.join(process.cwd(), 'legacy-2d-portfolio', 'clean_data.json');
      if (fs.existsSync(localDataPath)) {
        const localData = JSON.parse(fs.readFileSync(localDataPath, 'utf8'));
        return res.status(200).json(localData);
      }
    } catch (e) {
      console.error('Fallback read error:', e);
    }

    return res.status(404).json({ error: 'Portfolio data not found' });
  }

  // POST or PUT: Update portfolio data
  if (req.method === 'POST' || req.method === 'PUT') {
    // Check Authorization
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const validPassword = process.env.ADMIN_PASSWORD || '225387@Km';
    const expectedToken = 'admin_session_' + Buffer.from(validPassword).toString('base64');

    if (token !== expectedToken && token !== validPassword) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid admin credentials' });
    }

    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { db } = await connectToDatabase();

      // Upsert the main document
      await db.collection('portfolio_content').updateOne(
        { _id: 'main' },
        {
          $set: {
            ...body,
            _id: 'main',
            updatedAt: new Date()
          }
        },
        { upsert: true }
      );

      return res.status(200).json({ success: true, message: 'Portfolio data updated in MongoDB successfully' });
    } catch (err) {
      console.error('Update error:', err);
      return res.status(500).json({ success: false, error: err.message || 'Database update failed' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
