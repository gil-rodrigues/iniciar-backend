import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

interface ITokenPayLoad {
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
    throw new AppError('JWT Token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const verifyToken = verify(token, authConfig.jwt.secret);

    const { sub } = verifyToken as ITokenPayLoad;

    req.user = {
      id: sub
    };

    return next();
  } catch {
    throw new AppError('JWT Token is missing');
  }
}
