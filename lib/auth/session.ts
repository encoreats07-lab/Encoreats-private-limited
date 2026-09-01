import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { UserRole } from "@prisma/client";

const AUTH_COOKIE_NAME = "encoreats_session";
const SECRET = process.env.AUTH_SECRET || "encoreats_super_secret_production_auth_key_2026";
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  exp: number;
}

/**
 * Sign payload object to base64url JWT token
 */
export function signToken(payload: Omit<JWTPayload, "exp">, expiresInSeconds = MAX_AGE_SECONDS): string {
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload = { ...payload, exp };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");

  const signature = createHmac("sha256", SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64url");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const expectedSignature = createHmac("sha256", SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest("base64url");

    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload: JWTPayload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString());
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Set HTTP-only session cookie
 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

/**
 * Clear session cookie
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Get current session payload from cookies
 */
export async function getSession(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch (error) {
    return null;
  }
}
