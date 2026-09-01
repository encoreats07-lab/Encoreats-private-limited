import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { checkRateLimit } from "@/lib/security/rateLimit";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, requireAuth: true, error: { code: "UNAUTHORIZED", message: "Please sign in to express interest in experiences." } },
        { status: 401 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") || "interest_register";
    const limit = checkRateLimit(`interest_${user.id}_${ip}`, 10, 60000);
    if (!limit.success) {
      return NextResponse.json(
        { success: false, error: { code: "RATE_LIMITED", message: "Too many attempts. Please wait." } },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { experienceSlug, seats = 1 } = body;

    if (!experienceSlug || typeof experienceSlug !== "string") {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Experience slug is required." } },
        { status: 400 }
      );
    }

    // Upsert experience in PostgreSQL database if not present
    let experience = await prisma.experience.findUnique({
      where: { slug: experienceSlug },
    });

    if (!experience) {
      experience = await prisma.experience.create({
        data: {
          title: experienceSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          slug: experienceSlug,
          category: "Culinary & Arts",
          city: "mumbai",
          tagline: "Intimate curated gathering",
          description: "Unrepeatable seasonal cultural experience.",
          price: 4500,
          capacity: 16,
          availableSeats: 16,
          date: "Seasonal Drop",
          venueName: "Secret Atelier",
          artistName: "Encoreats Directors",
          heroImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
          galleryImages: JSON.stringify([
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
          ]),
          published: true,
        },
      });
    }

    // Check if booking / interest already recorded
    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId: user.id,
        experienceId: experience.id,
      },
    });

    if (existingBooking) {
      // Toggle / remove or confirm existing interest
      if (existingBooking.status === "INTERESTED") {
        await prisma.booking.delete({ where: { id: existingBooking.id } });
        return NextResponse.json({
          success: true,
          isInterested: false,
          message: "Experience interest removed.",
        });
      }
      return NextResponse.json({
        success: true,
        isInterested: true,
        booking: existingBooking,
        message: "You are already registered for this experience.",
      });
    }

    // Create Booking record with INTERESTED status
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        experienceId: experience.id,
        seats: seats,
        totalPrice: experience.price * seats,
        status: "INTERESTED",
      },
    });

    // Create user notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: `Interest Registered: ${experience.title}`,
        message: `Your interest for ${experience.title} has been recorded. We will alert you when private seat allocations open.`,
        type: "EXPERIENCE",
        actionUrl: `/experiences/${experience.slug}`,
      },
    });

    return NextResponse.json({
      success: true,
      isInterested: true,
      booking,
      message: "Your interest has been recorded in PostgreSQL.",
    });
  } catch (error: any) {
    console.error("API /api/experiences/interest Error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to record interest." } },
      { status: 500 }
    );
  }
}
