const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || '').trim(),
  api_key: (process.env.CLOUDINARY_API_KEY || '').trim(),
  api_secret: (process.env.CLOUDINARY_API_SECRET || '').trim(),
  secure: true
});

/**
 * Uploads an in-memory buffer to Cloudinary using upload_stream.
 * Perfect for Serverless environments (Vercel Lambda).
 * @param {Buffer} fileBuffer - Image buffer from Multer memoryStorage
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {Promise<{secure_url: string, public_id: string}>}
 */
const uploadToCloudinary = (fileBuffer, folder = 'qfi_cafe_menu') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'image'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Deletes an image from Cloudinary using public_id
 * @param {string} publicId 
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Cloudinary destroy error:', err);
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary
};
