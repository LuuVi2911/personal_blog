import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

/**
 * Upload options for different resource types
 */
export type UploadFolder = "blog" | "projects" | "resume";

export interface UploadOptions {
  folder: UploadFolder;
  resourceType?: "image" | "raw" | "auto";
  allowedFormats?: string[];
}

/**
 * Upload a file buffer to Cloudinary
 * @param buffer - File buffer to upload
 * @param options - Upload options including folder and resource type
 * @returns Cloudinary URL of the uploaded file
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  options: UploadOptions
): Promise<string> {
  const { folder, resourceType = "image", allowedFormats } = options;

  return new Promise((resolve, reject) => {
    const uploadOptions: Record<string, unknown> = {
      folder: `portfolio/${folder}`,
      resource_type: resourceType,
    };

    if (allowedFormats) {
      uploadOptions.allowed_formats = allowedFormats;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error("Upload failed: No result returned"));
        }
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete a file from Cloudinary by public_id
 * @param publicId - The public ID of the file to delete
 * @param resourceType - The resource type (image, raw, etc.)
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "raw" | "auto" = "image"
): Promise<void> {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
}

/**
 * Extract public_id from a Cloudinary URL
 * @param url - Cloudinary URL
 * @returns Public ID or null if not a valid Cloudinary URL
 */
export function getPublicIdFromUrl(url: string): string | null {
  if (!url || !url.includes("cloudinary.com")) {
    return null;
  }

  // Match pattern: .../upload/v{version}/{public_id}.{extension}
  // or: .../upload/{public_id}.{extension}
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
  return match ? match[1] : null;
}

/**
 * Check if a URL is a Cloudinary URL
 */
export function isCloudinaryUrl(url: string): boolean {
  return url?.includes("res.cloudinary.com") ?? false;
}
