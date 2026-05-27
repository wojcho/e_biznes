import { Router } from "express";
import { loginEndpoint } from "./login-endpoint.ts";
import { registerEndpoint } from "./register-endpoint.ts";

const publicRouter = Router();
publicRouter.post("/login", loginEndpoint);
publicRouter.post("/register", registerEndpoint);

export default publicRouter;
