import { v2 as cloudinary } from "cloudinary";

function configureCloudinary() {
  const url = process.env.CLOUDINARY_URL;
  const match = url && /^cloudinary:\/\/([^:]+):([^@]+)@([^/?]+)/.exec(url);
  if (!match) {
    throw new Error("Set CLOUDINARY_URL in .env (from Cloudinary → API Keys).");
  }
  cloudinary.config({
    cloud_name: match[3],
    api_key: match[1],
    api_secret: match[2],
    secure: true,
  });
}

export async function saveVisitorPhoto(dataUrl: string, folder = "vms/visitors") {
  const match = /^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/i.exec(dataUrl);
  if (!match) {
    throw new Error("Photo must be a JPEG, PNG, or WebP image.");
  }

  if (Buffer.from(match[2], "base64").byteLength > 3 * 1024 * 1024) {
    throw new Error("Photo is too large. Capture a smaller image.");
  }

  configureCloudinary();

  try {
    const result = await cloudinary.uploader.upload(dataUrl, {
      folder,
      resource_type: "image",
    });
    if (!result.secure_url) {
      throw new Error("Cloudinary did not return a photo URL.");
    }
    return result.secure_url;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    throw new Error(message);
  }
}

export function visitorPhotoUrlForEmail(secureUrl: string) {
  return secureUrl.replace("/upload/", "/upload/w_360,h_360,c_fill,q_auto,f_auto/");
}
