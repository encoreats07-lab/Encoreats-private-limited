import { uploadLocalFile } from "./local";

export async function uploadS3File(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
  folder = "uploads"
): Promise<{ success: boolean; url: string; error?: string }> {
  const bucket = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_REGION || "us-east-1";
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!bucket || !accessKeyId || !secretAccessKey) {
    console.warn("AWS S3 credentials missing. Falling back to local storage.");
    return uploadLocalFile(fileBuffer, fileName, folder);
  }

  try {
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
    const s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const safeName = `${folder}/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: safeName,
        Body: fileBuffer,
        ContentType: contentType,
      })
    );

    const s3Url = `https://${bucket}.s3.${region}.amazonaws.com/${safeName}`;
    return { success: true, url: s3Url };
  } catch (error: any) {
    console.error("AWS S3 upload error:", error);
    return uploadLocalFile(fileBuffer, fileName, folder);
  }
}

/**
 * Generates temporary signed URL for private KYC documents when AWS S3 is configured,
 * or returns local URL in development.
 */
export async function getSignedDocumentUrl(fileUrl: string): Promise<string> {
  const bucket = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_REGION || "us-east-1";
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!bucket || !accessKeyId || !secretAccessKey || !fileUrl.includes("amazonaws.com")) {
    return fileUrl; // Return standard local/direct URL
  }

  try {
    const { S3Client, GetObjectCommand } = await import("@aws-sdk/client-s3");
    const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");

    const s3Client = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });

    // Extract object key from URL
    const urlObj = new URL(fileUrl);
    const key = urlObj.pathname.substring(1);

    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 }); // 15 mins
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return fileUrl;
  }
}
