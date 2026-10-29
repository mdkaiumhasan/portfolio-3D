import { connectToDatabase } from './_db.js';
import { verifyAdminRequest } from './_auth.js';
import fs from 'fs';
import path from 'path';

function normalizePortfolioData(raw) {
  if (!raw || typeof raw !== 'object') return raw;
  const data = { ...raw };

  if (!Array.isArray(data.skill_categories) || data.skill_categories.length === 0) {
    data.skill_categories = ['Network Engineering', 'Security & Systems', 'Programming & Software'];
  }

  if (Array.isArray(data.skills)) {
    data.skills = data.skills.map((s) => {
      if (!s || typeof s !== 'object') return s;
      const item = { ...s };
      if (!item.category || item.category.trim() === '') {
        const name = (item.name || '').toUpperCase();
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
          item.category = 'Network Engineering';
        } else if (
          name.includes('FIREWALL') ||
          name.includes('SECURITY') ||
          name.includes('VPN') ||
          name.includes('ACL')
        ) {
          item.category = 'Security & Systems';
        } else if (
          name.includes('C++') ||
          name.includes('PYTHON') ||
          name.includes('REACT') ||
          name.includes('JS') ||
          name.includes('NODE') ||
          name.includes('JAVA')
        ) {
          item.category = 'Programming & Software';
        } else {
          item.category = data.skill_categories[0] || 'Network Engineering';
        }
      }
      return item;
    });
  }

  if (!Array.isArray(data.project_categories) || data.project_categories.length === 0) {
    const existingProjCats = Array.isArray(data.projects)
      ? Array.from(new Set(data.projects.map((p) => p?.category).filter(Boolean)))
      : [];
    data.project_categories = existingProjCats.length > 0
      ? existingProjCats
      : ['Networking & Security', 'Mobile & Realtime', 'Robotics & Hardware'];
  }

  if (!Array.isArray(data.blog_categories) || data.blog_categories.length === 0) {
    const existingCats = Array.isArray(data.posts)
      ? Array.from(new Set(data.posts.map((p) => p?.category).filter(Boolean)))
      : [];
    data.blog_categories = existingCats.length > 0
      ? existingCats
      : ['Tutorial', 'Networking Guide', 'Network Architecture', 'Career & Certification'];
  }

  if (typeof data.available_for_work !== 'boolean') {
    data.available_for_work = true;
  }

  return data;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Fetch portfolio data
  if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase();
      const content = await db.collection('portfolio_content').findOne({ _id: 'main' });

      if (content) {
        const { _id, ...rest } = content;
        const normalized = normalizePortfolioData(rest);
        return res.status(200).json(normalized);
      }
    } catch (err) {
      console.warn('MongoDB fetch unavailable, trying local static JSON fallback:', err.message);
    }

    // Fallback to public/data/legacy_data.json or legacy-2d-portfolio/clean_data.json
    const candidatePaths = [
      path.join(process.cwd(), 'public', 'data', 'legacy_data.json'),
      path.join(process.cwd(), 'legacy-2d-portfolio', 'clean_data.json')
    ];

    for (const candidate of candidatePaths) {
      try {
        if (fs.existsSync(candidate)) {
          const localData = JSON.parse(fs.readFileSync(candidate, 'utf8'));
          const normalized = normalizePortfolioData(localData);
          return res.status(200).json(normalized);
        }
      } catch (e) {
        console.warn('Fallback JSON read warning:', e.message);
      }
    }

    return res.status(404).json({ error: 'Portfolio data not found' });
  }

  // POST or PUT: Update portfolio data
  if (req.method === 'POST' || req.method === 'PUT') {
    const authCheck = verifyAdminRequest(req);
    if (!authCheck.authorized) {
      return res.status(authCheck.status).json({ success: false, error: authCheck.error });
    }

    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return res.status(400).json({ success: false, error: 'Invalid portfolio payload' });
      }

      const { _id, ...cleanBody } = body;
      const normalizedPayload = normalizePortfolioData(cleanBody);
      const { db } = await connectToDatabase();
      const updatedAt = new Date().toISOString();

      await db.collection('portfolio_content').updateOne(
        { _id: 'main' },
        {
          $set: {
            ...normalizedPayload,
            updatedAt
          }
        },
        { upsert: true }
      );

      // Sync local static fallback files when running in writable dev workspace
      try {
        const localCleanPath = path.join(process.cwd(), 'legacy-2d-portfolio', 'clean_data.json');
        const publicLegacyPath = path.join(process.cwd(), 'public', 'data', 'legacy_data.json');
        const syncJson = JSON.stringify({ ...normalizedPayload, updatedAt }, null, 2);
        if (fs.existsSync(path.dirname(localCleanPath))) fs.writeFileSync(localCleanPath, syncJson, 'utf8');
        if (fs.existsSync(path.dirname(publicLegacyPath))) fs.writeFileSync(publicLegacyPath, syncJson, 'utf8');
      } catch (_) {
        // Read-only filesystem in serverless production is expected
      }

      return res.status(200).json({
        success: true,
        updatedAt,
        message: 'Portfolio data updated in MongoDB successfully'
      });
    } catch (err) {
      console.error('Portfolio update error:', err);
      return res.status(500).json({ success: false, error: err.message || 'Database update failed' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
