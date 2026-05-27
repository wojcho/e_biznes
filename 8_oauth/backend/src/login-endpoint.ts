import type { Request, Response, NextFunction } from "express";
import { isValidUser } from "./mocked-db.ts";
import { type AuthPayload, signToken } from "./auth.ts";
import { TOKEN_COOKIE_NAME, TOKEN_EXPIRES_IN_MILLISECONDS } from "./config.ts";

export interface LoginPayload {
  username?: string;
  password?: string;
}

export const loginEndpoint = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body as LoginPayload;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and Password Required" });
    }
    if (!isValidUser(username, password)) {
      return res.status(401).json({ message: "User Not Recognized" });
    }
    const payload: AuthPayload = {
      username,
    }
    const token = signToken(payload);
    res.cookie(TOKEN_COOKIE_NAME, token, {
      httpOnly: true, // would not be accessible for arbitrary copying from JS in browser
      secure: false, // if using HTTPS would be true
      maxAge: TOKEN_EXPIRES_IN_MILLISECONDS,
    });
    res.json({ message: `Logged in as ${username}` });
  } catch (error) {
    next(error);
  }
}

export default loginEndpoint;
