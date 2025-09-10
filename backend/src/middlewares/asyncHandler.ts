import { NextFunction, Request, Response } from "express";

/**
 * Wrapper para middlewares assíncronos do Express.
 * Garante que erros em funções async sejam encaminhados ao tratamento padrão do Express.
 *
 * fn -> Função assíncrona que recebe (req, res, next)
 * @returns Middleware Express que trata erros automaticamente
 */

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};