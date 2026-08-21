import { Router } from 'express';
import { uploadImageToCloudinary } from '../cloudinary';
import { authMiddleware } from '../auth';

export const uploadRouter = Router();

// Upload image to Cloudinary (receives base64 string or remote image URL)
uploadRouter.post('/', authMiddleware, async (req, res) => {
  try {
    const { image, folder = 'blinkupz_products' } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data (base64 or URL) is required.' });
    }

    const uploadResult = await uploadImageToCloudinary(image, folder);

    return res.json({
      success: true,
      url: uploadResult.url,
      public_id: uploadResult.public_id,
      format: uploadResult.format,
      message: 'Image successfully uploaded to Cloudinary CDN',
    });
  } catch (error: any) {
    console.error('Upload route error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to upload image to Cloudinary CDN',
    });
  }
});
