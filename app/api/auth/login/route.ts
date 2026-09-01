import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validation";
import { comparePassword, signToken, setSessionCookie } from "@/lib/auth";
import { checkRateLimit } from "@/lib/security/rateLimit";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "client_login";
    const limit = checkRateLimit(`login_${ip}`, 10, 60000);
    if (!limit.success) {
      return NextResponse.json(
        { success: false, error: { code: "TOO_MANY_REQUESTS", message: "Too many login attempts. Please wait a minute." } },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: result.error.issues[0]?.message || "Invalid input" } },
        { status: 400 }
      );
    }

    const { email, password, honeypot } = result.data;

    if (honeypot) {
      return NextResponse.json({ success: true, message: "Logged in successfully." });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password." } },
        { status: 401 }
      );
    }

    const isValidPassword = comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password." } },
        { status: 401 }
      );
    }

    // Sign JWT & set HttpOnly Cookie
    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    await setSessionCookie(token);

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      city: user.city,
    };

    return NextResponse.json({
      success: true,
      user: safeUser,
      message: "Logged in successfully.",
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Authentication failed. Please try again." } },
      { status: 500 }
    );
  }
}
