import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function signJwt(
  object: Object,
  secret: "accessTokenPublicKey"| "refreshTokenPublicKey",
  options?: jwt.SignOptions | undefined
) {
  const load = jwt.sign(object, secret, { ...(options && options) });
  return load;
}

export function verifyJwt<T>(
  token: string,
  keyName: "accessTokenPrivateKey"| "refreshTokenPrivateKey",
  options?: jwt.SignOptions | undefined
): T | null {
  try {
    const decoded = jwt.verify(token, keyName, {
      ...(options && options),
    }) as T;
    return decoded;
  } catch (err) {
    return null;
  }
}
