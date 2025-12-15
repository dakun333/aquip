// lib/jwt.ts
import { SignJWT, jwtVerify, JWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");

// JWT 里你希望包含的用户信息
export interface JwtUserPayload {
  id: string;
  email: string;
  name: string;
}

export async function signUserJwt(
  user: JwtUserPayload,
  options?: { expiresIn?: string }
) {
  const exp = options?.expiresIn ?? "7d"; // 默认 7 天
  console.log("signUserJwt", exp);
  return await new SignJWT(user as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(secret);
}

export async function verifyUserJwt(token: string) {
  const { payload } = await jwtVerify<JwtUserPayload>(token, secret, {
    algorithms: ["HS256"],
  });
  return payload;
}
