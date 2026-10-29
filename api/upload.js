import { v2 as cloudinary } from 'cloudinary';
import { verifyAdminRequest } from './_auth.js';

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

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(503).json({
      success: false,
      error: 'Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are not configured.'
    });
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { image, folder = 'portfolio_assets' } = body;

    if (!image || typeof image !== 'string') {
      return res.status(400).json({ success: false, error: 'No valid image data provided' });
    }

    const safeFolder = /^[a-zA-Z0-9_/-]+$/.test(folder) ? folder : 'portfolio_assets';

    const uploadRes = await cloudinary.uploader.upload(image, {
      folder: safeFolder,
      resource_type: 'auto',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }]
    });

    return res.status(200).json({
      success: true,
      url: uploadRes.secure_url,
      public_id: uploadRes.public_id,
      width: uploadRes.width,
      height: uploadRes.height
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Image upload to Cloudinary failed'
    });
  }
}
