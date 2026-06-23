import type { Request, Response, NextFunction } from "express";
import { TOKEN_COOKIE_NAME } from "./config.ts";

export const logoutEndpoint = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie(TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: false,
    });

    return res.json({
      message: "Logged out",
    });
  } catch (error) {
    next(error);
  }
};

export default logoutEndpoint;
