import { Router } from "express";
import jwt from "jsonwebtoken";

import { loginEndpoint } from "./login-endpoint.ts";
import { registerEndpoint } from "./register-endpoint.ts";
import { googleOAuthStart } from "./oauth-google-start.ts";
import { googleOAuthCallback } from "./oauth-google-callback.ts";
import { cookieTokenGetter } from "./auth.ts";
import { SECRET } from "./config.ts";

const publicRouter = Router();
publicRouter.post("/login", loginEndpoint);
publicRouter.post("/register", registerEndpoint);
publicRouter.get("/oauth/google", googleOAuthStart);
publicRouter.get("/oauth/google/callback", googleOAuthCallback);

publicRouter.get("/session", (req, res) => {
  try {
    const token = cookieTokenGetter(req);

    if (!token) {
      return res.status(401).json({
        authenticated: false,
      });
    }

    const payload = jwt.verify(token, SECRET);

    return res.json({
      authenticated: true,
      payload,
    });
  } catch {
    return res.status(401).json({
      authenticated: false,
    });
  }
});

export default publicRouter;
