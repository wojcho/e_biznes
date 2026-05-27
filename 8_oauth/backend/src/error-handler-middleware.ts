import type { Request, Response, NextFunction } from "express";

export interface StatusError extends Error {
  status?: number;
}

export const errorHandler = (
  err: StatusError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  res.status(err.status ?? 500).json({
    message: err.message ?? "Internal Server Error",
  });
};

export default errorHandler;
