import type { Request, Response, NextFunction } from "express";
import { createUser } from "./mocked-db.ts";
import type { LoginRegisterPayload } from "./auth.ts";

export const registerEndpoint = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body as LoginRegisterPayload;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and Password Required" });
  }
  createUser(username, password);
  res.json({ message: `Registered new account ${username}` });
}

export default registerEndpoint;
