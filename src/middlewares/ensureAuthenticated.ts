import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../config/auth';

interface TokenPayLoad {
  iat: string;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new Error('JWT Token is missing');
  }

  const [, token] = authHeader.split(' ');

  try {
    const verifyToken = verify(token, authConfig.jwt.secret);

    const { sub } = verifyToken as TokenPayLoad;

    return next();
  } catch {
    throw new Error('JWT Token is missing');
  }
}
