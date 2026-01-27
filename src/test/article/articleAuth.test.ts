import request from 'supertest';
import app from '../../app';
import prisma from '../../lib/prisma';
import bcrypt from 'bcrypt';

describe('게시글 API 인증 필요', () => {
  const agent = request.agent(app); // 상태 유지를 위한 agent 사용
  beforeAll(async () => {
    // 테스트용 유저 생성
    const hashedPassword = await bcrypt.hash('password123', 10);
    // 먼저 유저 생성
    await prisma.user.create({
      data: {
        nickname: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
      },
    });
    await request(app).post('/auth/login').send({
      nickname: 'testuser',
      password: 'password123',
    });
  });

  afterEach(async () => {
    await prisma.article.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // 인증된 상태에서 게시글 생성 테스트
});
