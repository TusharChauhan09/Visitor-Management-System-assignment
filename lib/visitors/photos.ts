import { v2 as cloudinary } from "cloudinary";

/** One-time in Cloudinary: Settings → Upload → unsigned preset with this exact name. */
const VISITOR_UPLOAD_PRESET = "vms_visitors";

function parseCloudinaryUrl() {
  const url = process.env.CLOUDINARY_URL;
  if (!url) {
    return null;
  }
  const match = /^cloudinary:\/\/([^:]+):([^@]+)@([^/?]+)/.exec(url);
  if (!match) {
    return null;
  }
  return { apiKey: match[1], apiSecret: match[2], cloudName: match[3] };
}

function ensureCloudinaryConfigured() {
  const parsed = parseCloudinaryUrl();
  if (!parsed) {
    throw new Error(
      "Set CLOUDINARY_URL in .env (copy the full value from Cloudinary → API Keys)."
    );
  }
  cloudinary.config({
    cloud_name: parsed.cloudName,
    api_key: parsed.apiKey,
    api_secret: parsed.apiSecret,
    secure: true,
  });
  return parsed;
}

function cloudinaryErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === "string") {
      return message;
    }
  }
  return "Cloudinary could not store the photo. Check CLOUDINARY_URL in .env.";
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

  ensureCloudinaryConfigured();

  async function finishUpload(
    result: { secure_url?: string },
    label: string
  ) {
    if (!result.secure_url) {
      throw new Error(`Cloudinary did not return a photo URL (${label}).`);
    }
    return result.secure_url;
  }

  try {
    const unsigned = await cloudinary.uploader.upload(dataUrl, {
      upload_preset: VISITOR_UPLOAD_PRESET,
    });
    return await finishUpload(unsigned, "unsigned");
  } catch (unsignedError) {
    const unsignedMessage = cloudinaryErrorMessage(unsignedError);
    const presetMissing = /upload preset not found/i.test(unsignedMessage);

    if (!presetMissing) {
      throw new Error(unsignedMessage);
    }

    try {
      const signed = await cloudinary.uploader.upload(dataUrl, {
        folder: "vms/visitors",
        resource_type: "image",
      });
      return await finishUpload(signed, "signed");
    } catch (signedError) {
      const signedMessage = cloudinaryErrorMessage(signedError);
      throw new Error(
        `Photo upload failed. In Cloudinary → Settings → Upload, add an unsigned preset named "${VISITOR_UPLOAD_PRESET}", or update CLOUDINARY_URL with a key that can upload. (${signedMessage})`
      );
    }
  }
}

/** Sized for email clients (Cloudinary transformation). */
export function visitorPhotoUrlForEmail(secureUrl: string) {
  return secureUrl.replace("/upload/", "/upload/w_360,h_360,c_fill,q_auto,f_auto/");
}
