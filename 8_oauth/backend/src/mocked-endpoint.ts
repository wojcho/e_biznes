import type { Request, Response, NextFunction } from "express";

export const mockedEndpoint = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] ?? "a" : req.params.id ?? "a", 10); // id can be array or undefined, handle it by causing it to be null
    if (id === null || id === undefined || Number.isNaN(id) || !Number.isFinite(id)) {
      next({"status": 500, "message": "Incorrect ID"});
    } else {
      const output = {
        id,
        data: "Sample Text! Very good sample data!"
      };
      res.json(output);
    }
  } catch (error) {
    next(error);
  }
};

export default mockedEndpoint;
