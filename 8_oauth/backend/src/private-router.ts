import { Router } from "express";
import { jwtGateMiddleware } from "./auth.ts";
import { mockedEndpoint } from "./mocked-endpoint.ts";

const privateRouter = Router();
privateRouter.use(jwtGateMiddleware);
privateRouter.get("/items/:id", mockedEndpoint);

export default privateRouter;
