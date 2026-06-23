import type { Request, Response, NextFunction } from "express";
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_REDIRECT_URI,
  TOKEN_COOKIE_NAME,
  TOKEN_EXPIRES_IN_MILLISECONDS,
  CLIENT_REDIRECT_URI,
} from "./config.ts";

import { signToken } from "./auth.ts";
import { createOAuthUser, findOAuthUser } from "./mocked-db.ts";

export const githubOAuthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const code = req.query.code;

    if (!code || typeof code !== "string") {
      return res.status(400).json({ message: "Missing code" });
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: GITHUB_REDIRECT_URI,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return res.status(401).json({ message: "GitHub auth failed" });
    }

    // Fetch user profile
    const profileResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "express-app",
      },
    });

    const profile = await profileResponse.json();

    // Get email (GitHub requires separate call)
    const emailResponse = await fetch(
      "https://api.github.com/user/emails",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "express-app",
        },
      }
    );

    const emails = await emailResponse.json();
    const primaryEmail = emails.find((e: any) => e.primary)?.email;

    const providerId = String(profile.id);

    // Find or create user
    let user = findOAuthUser("github", providerId);

    if (!user) {
      user = {
        provider: "github",
        providerId,
        username: profile.login ?? primaryEmail ?? "github_user",
        accessToken,
      };

      createOAuthUser(user);
    }

    // Issue application custom JWT
    const jwtToken = signToken({
      username: user.username,
    });

    res.cookie(TOKEN_COOKIE_NAME, jwtToken, {
      httpOnly: true,
      secure: false,
      maxAge: TOKEN_EXPIRES_IN_MILLISECONDS,
    });

    res.redirect(CLIENT_REDIRECT_URI);
  } catch (error) {
    next(error);
  }
};
