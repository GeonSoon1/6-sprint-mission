import request from 'supertest';
import app from '../../app';
import prisma from '../../lib/prisma';
import bcrypt from 'bcrypt';

describe('로그인 및 회원가입 API', () => {
  beforeEach(async () => {
    // 기존 데이터 정리
    await prisma.user.deleteMany();
  });

  test('POST /auth/register - 회원가입', async () => {
    const response = await request(app).post('/auth/register').send({
      nickname: 'testuser2',
      email: 'test2@example.com',
      password: 'password123',
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('nickname', 'testuser2');
    expect(response.body).toHaveProperty('email', 'test2@example.com');
  });

  test('POST /auth/login - 로그인', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    // 먼저 유저 생성
    await prisma.user.create({
      data: {
        nickname: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
      },
    });
    const response = await request(app).post('/auth/login').send({
      nickname: 'testuser',
      password: 'password123',
    });

    const cookies = response.headers['set-cookie'];

    expect(response.status).toBe(200);
    expect(cookies[0]).toMatch(/access-token=/);
    expect(cookies[1]).toMatch(/refresh-token=/);
  });
});
