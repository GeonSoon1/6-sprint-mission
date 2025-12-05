import * as express from 'express';
import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, 'password'>;
      paginationParams?: {
        limit: number;
        offset?: number;
        cursor?: string;
      };
    }
  }
}
