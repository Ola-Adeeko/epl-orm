import { Request, Response, NextFunction } from "express";

function errorHandler(
  err: { statusCode: number; message: string },
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    error: {
      message: message,
      statusCode: status,
    },
  });
}

export default errorHandler;
