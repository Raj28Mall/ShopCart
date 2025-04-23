import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // Bearer <token>

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  try {
    const secret = process.env["JWT_SECRET"] as string;
    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token." });
    return;
  }
};
