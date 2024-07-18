import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsgs = errors
      .array()
      .map((error) => ({ status: false, message: error.msg }));
    return res.status(400).json({ status: false, message: errorMsgs });
  }
  next();
};
