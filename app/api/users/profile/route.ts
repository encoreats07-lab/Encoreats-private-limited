import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateProfileSchema } from "@/lib/validation";

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required to update profile." } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const result = updateProfileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid input fields." } },
        { status: 400 }
      );
    }

    const { fullName, phone, city, bio, avatarUrl, interests } = result.data;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: fullName,
        phone: phone || null,
        city: city,
        bio: bio || null,
        avatarUrl: avatarUrl || null,
        interests: interests ? JSON.stringify(interests) : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        city: true,
        bio: true,
        avatarUrl: true,
        interests: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully.",
    });
  } catch (error: any) {
    console.error("API /api/users/profile PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to update profile." } },
      { status: 500 }
    );
  }
}
