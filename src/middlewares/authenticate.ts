import { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../lib/prismaClient.js';
import { verifyAccessToken } from '../lib/token.js';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants.js';

interface AuthenticateOptions {
  optional?: boolean;
}

function authenticate(options: AuthenticateOptions = { optional: false }) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
    if (!accessToken) {
      if (options.optional) {
        return next();
      }
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    try {
      const { id } = verifyAccessToken(accessToken);
      const user = await prismaClient.user.findUnique({ where: { id } });
      req.user = user;
    } catch (error) {
      if (options.optional) {
        return next();
      }
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    next();
  };
}

export default authenticate;

