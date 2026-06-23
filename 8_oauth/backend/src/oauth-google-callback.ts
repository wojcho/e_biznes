import type {
  Request,
  Response,
  NextFunction
} from "express";

import {
  CLIENT_REDIRECT_URI,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  TOKEN_COOKIE_NAME,
  TOKEN_EXPIRES_IN_MILLISECONDS
} from "./config.ts";

import { signToken } from "./auth.ts";

import {
  createOAuthUser,
  findOAuthUser
} from "./mocked-db.ts";

// Frontend
//     |
//     | GET /api-public/oauth/google
//     v
// Server
//     |
//     | redirect
//     v
// Google Login Page
//     |
//     | login
//     v
// Google
//     |
//     | GET /api-public/oauth/google/callback?code=...
//     v
// Server
//     |
//     | POST /token
//     | GET /userinfo
//     |
//     | store google access token
//     | store refresh token
//     | store user profile
//     |
//     | generate custom JWT
//     | set cookie(token=<custom JWT>)
//     |
//     | redirect /
//     v
// Frontend

// Future requests:
// Frontend
//     |
//     | cookie: token=<custom JWT>
//     v
// Server
//     |
//     | jwtGateMiddleware
//     v
// Protected API

export const googleOAuthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const code = req.query.code;

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        message: "Missing code"
      });
    }

    const tokenResponse = await fetch(
      "https://oauth2.googleapis.com/token",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: GOOGLE_REDIRECT_URI,
          grant_type: "authorization_code"
        })
      }
    );

    const tokenData =
      await tokenResponse.json();

    const accessToken =
      tokenData.access_token;

    const refreshToken =
      tokenData.refresh_token;

    const profileResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization:
            `Bearer ${accessToken}`
        }
      }
    );

    const profile =
      await profileResponse.json();

    const providerId = profile.id;

    let user = findOAuthUser(
      "google",
      providerId
    );

    if (!user) {
      createOAuthUser({
        provider: "google",
        providerId,
        username:
          profile.email ??
          profile.name,

        accessToken,
        refreshToken
      });

      user = {
        provider: "google",
        providerId,
        username:
          profile.email ??
          profile.name,

        accessToken,
        refreshToken
      };
    }

    const jwtToken = signToken({
      username: user.username
    });

    res.cookie(
      TOKEN_COOKIE_NAME,
      jwtToken,
      {
        httpOnly: true,
        secure: false,
        maxAge:
          TOKEN_EXPIRES_IN_MILLISECONDS
      }
    );

    res.redirect(CLIENT_REDIRECT_URI);
  } catch (error) {
    next(error);
  }
};
