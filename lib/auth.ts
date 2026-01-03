import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("Please define the JWT_SECRET environment variable.");
}

const secretKey = new TextEncoder().encode(secret);

export interface SessionPayload extends JWTPayload {
  sub: string;
  role: "business";
  username: string;
  businessName: string;
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .setSubject(payload.sub)
    .sign(secretKey);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify<SessionPayload>(token, secretKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.error("Failed to verify session", error);
    return null;
  }
}
