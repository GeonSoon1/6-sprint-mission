import request from 'supertest';
import app from '../src/app';
import prisma from '../src/libs/prismaClient';

describe('Auth 통합 테스트', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /users/registration', () => {
    test('회원가입 성공 (201)', async () => {
      const res = await request(app).post('/users/registration').send({
        email: 'test@example.com',
        nickname: '테스터',
        password: 'password123',
      });
      expect(res.status).toBe(201);
      expect(res.body.email).toBe('test@example.com');
    });
    test('회원가입 실패 - 중복 이메일 (409 or 400)', async () => {
      const res = await request(app).post('/users/registration').send({
        email: 'test@example.com',
        nickname: '테스터2',
        password: 'password123',
      });
      expect(res.status).not.toBe(201);
    });
  });

  describe('POST /users/login', () => {
    test('로그인 성공 (200)', async () => {
      const res = await request(app).post('/users/login').send({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(res.status).toBe(200);

      const cookies = res.headers['set-cookie'] as unknown as string[];
      expect(cookies).toBeDefined();
      expect(
        cookies.some((cookie: string) => cookie.includes('accessToken'))
      ).toBe(true);
    });
    test('로그인 실패 - 비밀번호 불일치 (401 or 400)', async () => {
      const res = await request(app).post('/users/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });
      expect(res.status).not.toBe(200);
    });
  });
});
