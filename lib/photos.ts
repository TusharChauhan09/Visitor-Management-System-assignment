import { v2 as cloudinary } from "cloudinary";

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env"
    );
  }

  return { cloudName, apiKey, apiSecret };
}

export async function saveVisitorPhoto(dataUrl: string) {
  const match = /^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/i.exec(dataUrl);
  if (!match) {
    throw new Error("Photo must be a JPEG, PNG, or WebP image.");
  }

  const buffer = Buffer.from(match[2], "base64");
  if (buffer.byteLength > 3 * 1024 * 1024) {
    throw new Error("Photo is too large. Capture a smaller image.");
  }

  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  const result = await cloudinary.uploader.upload(dataUrl, {
    folder: "vms/visitors",
    resource_type: "image",
  });

  if (!result.secure_url) {
    throw new Error("Cloudinary did not return a photo URL.");
  }

  return result.secure_url;
}
