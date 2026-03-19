import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "defaultsecret";

export function generateToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function generateQrToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: 60 });
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET);
}
