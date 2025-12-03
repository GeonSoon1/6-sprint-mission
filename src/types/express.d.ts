import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // 나중에 구체적인 타입(User)으로 바꾸면 더 좋을듯
      paginationParams?: {
        offset: number;
        limit: number;
      };
    }
  }
}
