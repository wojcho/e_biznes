import type{ Request, Response } from "express";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_REDIRECT_URI
} from "./config.ts";

export const googleOAuthStart = (
  req: Request,
  res: Response
) => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent"
  });

  res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  );
};
