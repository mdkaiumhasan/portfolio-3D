import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dgomoujlo',
  api_key: process.env.CLOUDINARY_API_KEY || '428366322884523',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'WgHT2u__EILrXjPMcrRRGq078fE',
  secure: true
});

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

  // Admin authentication check
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  const validPassword = process.env.ADMIN_PASSWORD || '225387@Km';
  const expectedToken = 'admin_session_' + Buffer.from(validPassword).toString('base64');

  if (token !== expectedToken && token !== validPassword) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication required' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { image, folder = 'portfolio_assets' } = body;

    if (!image) {
      return res.status(400).json({ success: false, error: 'No image data provided' });
    }

    const uploadRes = await cloudinary.uploader.upload(image, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }
      ]
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
