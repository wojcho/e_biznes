import express from "express";
import cookieParser from "cookie-parser";
import privateRouter from "./private-router.ts";
import { SERVER_PORT } from "./config.ts";
import errorHandler from "./error-handler-middleware.ts";
import publicRouter from "./public-router.ts";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/", privateRouter);
app.use("/api-public/", publicRouter);

app.use(errorHandler);

app.listen(SERVER_PORT, () => {
  console.log(`Server running on port ${SERVER_PORT}`);
});
