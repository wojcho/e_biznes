import { Router } from "express";
import { loginEndpoint } from "./login-endpoint.ts";

const publicRouter = Router();
publicRouter.post("/login", loginEndpoint);

export default publicRouter;
