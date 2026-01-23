import request from 'supertest';
import { prismaClient } from '@lib/prismaClient';
import app from '@/app';

describe('인증이 필요하지 않은 상품 API 통합 테스트', () => {
  console.log('public product run!!');
});
