import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { APP_KEY } from "../config/env";
import { AuthorizationError } from "./error";

type TokenPayload = {
    iat: number;
    exp: number;
    sub: string;
}

export const auth = (request: Request,response: Response,next: NextFunction,) => {
  const authHeader = request.headers['authorization'];

  if (!authHeader) {
    throw new AuthorizationError('JWT token is missing');
  }

  const [, token] = authHeader.split(' ');
  try {
    const decoded = verify(token, APP_KEY ?? '');

    const { sub } = decoded as TokenPayload;

    request['user'] = {
      id: sub,
    };
    return next();
  } catch {
    throw new AuthorizationError('Invalid JWT token');
  }
}