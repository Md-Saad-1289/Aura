import { v2 as cloudinary } from 'cloudinary';
import { CONFIG } from './config';

cloudinary.config({
  cloud_name: CONFIG.CLOUDINARY.CLOUD_NAME,
  api_key: CONFIG.CLOUDINARY.API_KEY,
  api_secret: CONFIG.CLOUDINARY.API_SECRET,
  secure: true,
});

export { cloudinary };

export async function uploadImageToCloudinary(
  fileOrBase64: string,
  folder = 'blinkupz_store'
): Promise<{ url: string; public_id: string; format: string }> {
  try {
    const result = await cloudinary.uploader.upload(fileOrBase64, {
      folder,
      resource_type: 'auto',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });
    return {
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
    };
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    throw new Error(error?.message || 'Failed to upload image to Cloudinary');
  }
}
