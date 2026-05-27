import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SECRET, TOKEN_EXPIRES_IN, TOKEN_COOKIE_NAME } from "./config.ts";

export interface AuthPayload {
  username: string;
}

export interface LoginRegisterPayload {
  username?: string;
  password?: string;
}

export const signToken = (payload: object) => {
  return jwt.sign(payload, SECRET, { algorithm: "HS256", expiresIn: TOKEN_EXPIRES_IN });
}

export const cookieTokenGetter = (req: Request) => {
  return (req.cookies && req.cookies[TOKEN_COOKIE_NAME]) || undefined;
};

export const jwtGateMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = cookieTokenGetter(req);
    if (!token) {
      return res.status(401).json({ message: "Missing Authentication Token" });
    }
    const decoded = jwt.verify(token, SECRET, { algorithms: ["HS256"] }) as AuthPayload;

    if (!decoded || typeof decoded !== "object") {
      return res.status(401).json({ message: "Incorrect Token Payload" });
    }

    const username = decoded.username;
    if (!username || typeof username !== "string") {
      return res.status(401).json({ message: "Token Missing Username" });
    }

    next();
  } catch (error) {
    if (error && (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError)) { // jwt.verify has thrown, https://www.npmjs.com/package/jsonwebtoken
      return res.status(401).json({ message: error.message });
    }
    return res.status(401).json({ message: "Authentication Token Error" });
  }
};
