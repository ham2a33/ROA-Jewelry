import "server-only";

import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const [salt, keyHex] = storedHash.split(":");
  if (!salt || !keyHex) {
    return false;
  }

  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  const keyBuffer = Buffer.from(keyHex, "hex");

  if (keyBuffer.length !== derived.length) {
    return false;
  }

  return timingSafeEqual(derived, keyBuffer);
}
