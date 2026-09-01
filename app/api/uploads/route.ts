import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security/rateLimit";
import fs from "fs";
import path from "path";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "pdf", "mp4", "webm"];
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
  "video/mp4",
  "video/webm",
];

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateCheck = checkRateLimit(`uploads_${ip}`, 15, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: { code: "RATE_LIMITED", message: "Upload rate limit exceeded. Please wait a minute." } },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "No file provided in form data." } },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: { code: "FILE_TOO_LARGE", message: "File exceeds 10MB limit." } },
        { status: 400 }
      );
    }

    const fileExtension = (file.name.split(".").pop() || "bin").toLowerCase();
    const isValidMime = ALLOWED_MIME_TYPES.includes(file.type);
    const isValidExt = ALLOWED_EXTENSIONS.includes(fileExtension);

    if (!isValidMime && !isValidExt) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_FILE_TYPE", message: "Only JPEG, PNG, WEBP, PDF, and MP4 files are allowed." } },
        { status: 400 }
      );
    }

    const sanitizeName = file.name.replace(/[^a-zA-Z0-9]/g, "_");
    const uniqueFilename = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${sanitizeName}.${fileExtension}`;

    // AWS S3 handling if bucket configured
    const s3Bucket = process.env.AWS_S3_BUCKET;
    if (s3Bucket && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      try {
        const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
        const s3Client = new S3Client({
          region: process.env.AWS_REGION || "us-east-1",
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
        });

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await s3Client.send(
          new PutObjectCommand({
            Bucket: s3Bucket,
            Key: `uploads/${uniqueFilename}`,
            Body: buffer,
            ContentType: file.type || "application/octet-stream",
          })
        );

        const s3Url = `https://${s3Bucket}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/uploads/${uniqueFilename}`;
        return NextResponse.json(
          {
            success: true,
            url: s3Url,
            file: {
              name: file.name,
              size: file.size,
              type: file.type,
              key: `uploads/${uniqueFilename}`,
            },
          },
          { status: 201 }
        );
      } catch (s3Err) {
        console.error("S3 upload error, falling back to local:", s3Err);
      }
    }

    // Local storage fallback for development / local mode
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, uniqueFilename);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${uniqueFilename}`;
    return NextResponse.json(
      {
        success: true,
        url: fileUrl,
        file: {
          name: file.name,
          size: file.size,
          type: file.type,
          key: uniqueFilename,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("API /api/uploads Error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message || "Failed to upload file." } },
      { status: 500 }
    );
  }
}
