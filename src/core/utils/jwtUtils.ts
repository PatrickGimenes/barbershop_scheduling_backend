import { log } from "console";
import jwt, { SignOptions } from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const ACCESS_EXPIRES_IN: number = Number(
  process.env.ACCESS_TOKEN_EXPIRES_IN || 360
);

export function signAccessToken(payload: object) {
  const options: SignOptions = { expiresIn: ACCESS_EXPIRES_IN };
  console.log(options);
  return jwt.sign(payload, ACCESS_SECRET, options);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET);
}
