/**
 * Client-safe Cloudinary utility functions
 * These functions don't import the cloudinary Node.js package
 * and can be used in both client and server components
 */

/**
 * Check if a URL is a Cloudinary URL
 */
export function isCloudinaryUrl(url: string): boolean {
  return url?.includes("res.cloudinary.com") ?? false;
}

/**
 * Extract public_id from a Cloudinary URL
 * @param url - Cloudinary URL
 * @returns Public ID or null if not a valid Cloudinary URL
 */
export function getPublicIdFromUrl(url: string): string | null {
  if (!url || !isCloudinaryUrl(url)) {
    return null;
  }

  // Match pattern: .../upload/v{version}/{public_id}.{extension}
  // or: .../upload/{public_id}.{extension}
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
  return match ? match[1] : null;
}

/**
 * Convert Cloudinary image/upload URL to raw/upload for proper PDF serving
 * @param url - Original Cloudinary URL
 * @returns URL with raw resource type
 */
export function getCloudinaryRawUrl(url: string): string {
  if (!url || !isCloudinaryUrl(url)) {
    return url;
  }
  // Convert /image/upload/ to /raw/upload/ for proper PDF serving
  return url.replace("/image/upload/", "/raw/upload/");
}

/**
 * Transform a Cloudinary URL for PDF viewing/download
 * @param url - Original Cloudinary URL
 * @param options - Options for transformation
 * @returns Transformed URL
 */
export function getCloudinaryPdfUrl(
  url: string,
  options: { forceDownload?: boolean; useGoogleViewer?: boolean } = {}
): string {
  if (!url) {
    return url;
  }

  const { forceDownload = false, useGoogleViewer = false } = options;

  // First, ensure we're using raw URL for PDFs
  let pdfUrl = getCloudinaryRawUrl(url);

  // For Google Docs Viewer (reliable inline PDF viewing)
  if (useGoogleViewer) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
  }

  // For Cloudinary URLs, we can add transformations
  if (isCloudinaryUrl(pdfUrl)) {
    if (forceDownload) {
      // Add fl_attachment flag to force download
      return pdfUrl.replace("/upload/", "/upload/fl_attachment/");
    }
  }

  // Return URL as-is for direct viewing/download
  return pdfUrl;
}
