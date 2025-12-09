// TODO) Prisma-Singleton: 환경, 설정, 공통 미들웨어 정의
// ?) PrismaClient DB 연결 중복 예방
import './env.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log:
    process.env.DEBUG_MODE === 'true'
      ? ['query', 'info', 'warn', 'error']
      : ['error'],
});

export default prisma;
