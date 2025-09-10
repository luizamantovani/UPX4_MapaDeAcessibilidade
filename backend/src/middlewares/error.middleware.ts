import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../utils/error-handler"; 

export function errorMiddleware(err: any, _req: Request, res: Response, _next: NextFunction) {
  errorHandler.handleError(res, err);
}