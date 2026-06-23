import type { Request, Response } from "express";
import {
  GITHUB_CLIENT_ID,
  GITHUB_REDIRECT_URI,
} from "./config.ts";

export const githubOAuthStart = (req: Request, res: Response) => {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_REDIRECT_URI,
    scope: "read:user user:email",
    allow_signup: "true",
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
};
