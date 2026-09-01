import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { checkRateLimit } from "@/lib/security/rateLimit";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required to submit memories." } },
        { status: 401 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") || "memories_api";
    const limit = checkRateLimit(`memories_${user.id}_${ip}`, 5, 60000);
    if (!limit.success) {
      return NextResponse.json(
        { success: false, error: { code: "RATE_LIMITED", message: "Too many memory submissions. Please wait." } },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { experienceId, rating, reviewContent, mediaUrl, caption } = body;

    if (!experienceId) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Experience ID is required." } },
        { status: 400 }
      );
    }

    let review = null;
    let memory = null;

    // Create Review if content present
    if (reviewContent && reviewContent.trim()) {
      review = await prisma.experienceReview.create({
        data: {
          userId: user.id,
          experienceId: experienceId,
          rating: rating || 5,
          content: reviewContent.trim(),
        },
      });
    }

    // Create Memory if photo/video media URL present
    if (mediaUrl && mediaUrl.trim()) {
      const isVideo = mediaUrl.endsWith(".mp4") || mediaUrl.endsWith(".webm");
      memory = await prisma.experienceMemory.create({
        data: {
          userId: user.id,
          experienceId: experienceId,
          mediaUrl: mediaUrl.trim(),
          mediaType: isVideo ? "VIDEO" : "IMAGE",
          caption: caption || null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      review,
      memory,
      message: "Experience memory saved successfully.",
    });
  } catch (error: any) {
    console.error("API /api/experiences/memories Error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to save memory." } },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    const reviews = await prisma.experienceReview.findMany({
      where: { userId: user.id },
      include: { experience: true },
      orderBy: { createdAt: "desc" },
    });

    const memories = await prisma.experienceMemory.findMany({
      where: { userId: user.id },
      include: { experience: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      reviews,
      memories,
    });
  } catch (error: any) {
    console.error("API /api/experiences/memories GET Error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch memories." } },
      { status: 500 }
    );
  }
}
