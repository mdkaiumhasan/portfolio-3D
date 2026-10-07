import { connectToDatabase } from './_db.js';
import fs from 'fs';
import path from 'path';

function normalizePortfolioData(data) {
  if (!data || typeof data !== 'object') return data;
  
  if (!data.skill_categories || !Array.isArray(data.skill_categories) || data.skill_categories.length === 0) {
    data.skill_categories = ['Network Engineering', 'Security & Systems', 'Programming & Software'];
  }

  if (Array.isArray(data.skills)) {
    data.skills = data.skills.map((s) => {
      if (!s.category || s.category.trim() === '') {
        const name = (s.name || '').toUpperCase();
        if (
          name.includes('ROUTING') ||
          name.includes('SWITCHING') ||
          name.includes('CONFIGURE') ||
          name.includes('CISCO') ||
          name.includes('MIKROTIK') ||
          name.includes('NETWORK') ||
          name.includes('LAN') ||
          name.includes('WAN')
        ) {
          s.category = 'Network Engineering';
        } else if (
          name.includes('FIREWALL') ||
          name.includes('SECURITY') ||
          name.includes('VPN') ||
          name.includes('ACL')
        ) {
          s.category = 'Security & Systems';
        } else if (
          name.includes('C++') ||
          name.includes('PYTHON') ||
          name.includes('REACT') ||
          name.includes('JS') ||
          name.includes('NODE') ||
          name.includes('JAVA')
        ) {
          s.category = 'Programming & Software';
        } else {
          s.category = data.skill_categories[0] || 'Network Engineering';
        }
      }
      return s;
    });
  }

  return data;
}

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
        const normalized = normalizePortfolioData(content);
        return res.status(200).json(normalized);
      }
    } catch (err) {
      console.warn('MongoDB fetch error, falling back to local clean_data.json:', err.message);
    }

    // Fallback to local clean data
    try {
      const localDataPath = path.join(process.cwd(), 'legacy-2d-portfolio', 'clean_data.json');
      if (fs.existsSync(localDataPath)) {
        const localData = JSON.parse(fs.readFileSync(localDataPath, 'utf8'));
        const normalized = normalizePortfolioData(localData);
        return res.status(200).json(normalized);
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
      const normalizedPayload = normalizePortfolioData(body);
      const { db } = await connectToDatabase();

      // Upsert the main document
      await db.collection('portfolio_content').updateOne(
        { _id: 'main' },
        {
          $set: {
            ...normalizedPayload,
            _id: 'main',
            updatedAt: new Date()
          }
        },
        { upsert: true }
      );

      // Sync local files as backup
      try {
        const localCleanPath = path.join(process.cwd(), 'legacy-2d-portfolio', 'clean_data.json');
        const publicLegacyPath = path.join(process.cwd(), 'public', 'data', 'legacy_data.json');
        const syncJson = JSON.stringify({ ...normalizedPayload, updatedAt: new Date() }, null, 2);
        if (fs.existsSync(path.dirname(localCleanPath))) fs.writeFileSync(localCleanPath, syncJson, 'utf8');
        if (fs.existsSync(path.dirname(publicLegacyPath))) fs.writeFileSync(publicLegacyPath, syncJson, 'utf8');
      } catch (fileSyncErr) {
        console.warn('File sync warning:', fileSyncErr.message);
      }

      return res.status(200).json({ success: true, message: 'Portfolio data updated in MongoDB successfully' });
    } catch (err) {
      console.error('Update error:', err);
      return res.status(500).json({ success: false, error: err.message || 'Database update failed' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
