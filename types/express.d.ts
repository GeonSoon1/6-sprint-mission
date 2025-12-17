import type { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      file?: {
        filename: string;
        originalname: string;
      };
    }
  }
}

export {};
