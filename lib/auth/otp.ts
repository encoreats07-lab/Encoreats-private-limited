import { randomInt, createHmac, timingSafeEqual } from "crypto";

const OTP_SECRET = process.env.AUTH_SECRET || "encoreats_super_secret_production_auth_key_2026";

/**
 * Generate a cryptographically secure 6-digit OTP string.
 */
export function generateOTP(): string {
  return randomInt(100000, 999999).toString();
}

/**
 * Hash OTP string before storing in database.
 */
export function hashOTP(otp: string): string {
  return createHmac("sha256", OTP_SECRET).update(otp.trim()).digest("hex");
}

/**
 * Compare plain OTP against stored hash securely.
 */
export function verifyOTP(otp: string, storedHash: string): boolean {
  try {
    const hash = hashOTP(otp);
    const hashBuffer = Buffer.from(hash, "hex");
    const storedBuffer = Buffer.from(storedHash, "hex");
    if (hashBuffer.length !== storedBuffer.length) return false;
    return timingSafeEqual(hashBuffer, storedBuffer);
  } catch (error) {
    return false;
  }
}
