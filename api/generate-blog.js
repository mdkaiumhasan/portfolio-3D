import { verifyAdminRequest } from './_auth.js';

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const authCheck = verifyAdminRequest(req);
  if (!authCheck.authorized) {
    return res.status(authCheck.status).json({ success: false, error: authCheck.error });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim().length === 0) {
    return res.status(503).json({
      success: false,
      error: 'GEMINI_API_KEY is not configured on the server. Add it to .env.local or Vercel Environment Variables.'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const topic = String(body.topic || '').trim();
    const categories = Array.isArray(body.categories) ? body.categories : ['Tutorial', 'Networking Guide', 'Network Architecture'];

    if (!topic) {
      return res.status(400).json({ success: false, error: 'Blog topic is required' });
    }

    const prompt = `Write an authoritative, educational technical blog article for a certified Network Engineer & Fullstack Systems Developer's portfolio.
Topic: "${topic}"
Preferred categories (pick the closest fit or create a concise one): ${categories.join(', ')}.
Return ONLY valid JSON with these exact keys:
- "title": string (compelling technical headline)
- "category": string
- "shortDescription": string (2-3 sentence summary, plain text)
- "fullContentHtml": string (well-structured semantic HTML using <h2>, <h3>, <p>, <ul>, <li>, <strong>, <pre><code> — no <script> or <html> wrapper)`;

    let lastError = 'Gemini API request failed';

    for (const model of GEMINI_MODELS) {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const geminiRes = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      });

      if (!geminiRes.ok) {
        const errText = await geminiRes.text().catch(() => '');
        lastError = `Gemini (${model}) returned status ${geminiRes.status}${errText ? `: ${errText.slice(0, 180)}` : ''}`;
        continue;
      }

      const resData = await geminiRes.json();
      const rawText = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        lastError = 'Empty content returned by Gemini';
        continue;
      }

      const cleaned = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      const parsed = JSON.parse(cleaned);

      return res.status(200).json({
        success: true,
        article: {
          title: parsed.title || topic,
          category: parsed.category || categories[0] || 'Tutorial',
          shortDesc: parsed.shortDescription || parsed.shortDesc || '',
          fullContent: parsed.fullContentHtml || parsed.fullContent || '<p>Article content generated.</p>'
        }
      });
    }

    return res.status(502).json({ success: false, error: lastError });
  } catch (error) {
    console.error('Generate blog error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'AI blog generation failed'
    });
  }
}

