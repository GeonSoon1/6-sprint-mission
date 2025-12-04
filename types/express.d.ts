import express from 'express';
import type { User } from '@prisma/client';

// 전역 타입 설정
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      user?: User | object;
    }
  }
}
