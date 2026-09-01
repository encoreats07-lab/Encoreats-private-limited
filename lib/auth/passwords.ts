import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

/**
 * Hashes a plain-text password using Node.js native scrypt with a random salt.
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Compares a plain-text password against a stored scrypt hash.
 */
export function comparePassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = scryptSync(password, salt, 64);
    return timingSafeEqual(keyBuffer, derivedKey);
  } catch (error) {
    return false;
  }
}
