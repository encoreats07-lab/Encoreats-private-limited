import { uploadLocalFile } from "./local";
import { uploadS3File, getSignedDocumentUrl } from "./s3";

export * from "./local";
export * from "./s3";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export function validateFile(file: { size: number; type: string }): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: "File size exceeds 10MB limit." };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: "Invalid file type. Allowed formats: JPG, PNG, WEBP, PDF." };
  }

  return { valid: true };
}

export async function processFileUpload(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
  isPrivate = false
): Promise<{ success: boolean; url: string; error?: string }> {
  const folder = isPrivate ? "private_documents" : "uploads";

  if (process.env.AWS_S3_BUCKET && process.env.AWS_ACCESS_KEY_ID) {
    return uploadS3File(fileBuffer, fileName, contentType, folder);
  }

  return uploadLocalFile(fileBuffer, fileName, folder);
}
