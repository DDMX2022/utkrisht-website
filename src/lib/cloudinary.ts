// @ts-ignore - cloudinary types may not be resolved immediately
import { v2 as cloudinary } from 'cloudinary';
import { setDefaultResultOrder } from 'dns';

// Prefer IPv4 first to avoid DNS resolution issues on some networks
try {
  setDefaultResultOrder('ipv4first');
} catch {}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export function getUploadSignature(folder: string = 'utkrisht') {
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign: Record<string, string | number> = {
    timestamp,
    folder,
  };
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET as string
  );
  return { timestamp, signature, folder };
}

export { cloudinary };
