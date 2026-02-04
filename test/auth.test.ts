import request from 'supertest';
import { prismaClient } from '@lib/prismaClient';
import app from '@/app';

describe('회원가입 / 로그인 / 로그아웃 통합 테스트', () => {
  console.log('auth run!!');

  // 전체 작업을 통틀어 1번만 실행되는 DB 리셋
  beforeAll(async () => {
    // DB 데이터 삭제는 가장 관계 설정이 적은 단위부터 시행
    await prismaClient.notification.deleteMany();
    await prismaClient.like.deleteMany();
    await prismaClient.favorite.deleteMany();
    await prismaClient.comment.deleteMany();

    await prismaClient.article.deleteMany();
    await prismaClient.product.deleteMany();
  });

  // test마다 실행 될 DB 리셋 & 기본 셋팅
  beforeEach(async () => {
    await prismaClient.user.deleteMany();

    // 로그인 테스트를 위하여 임의로 user data 1개 입력
    await request(app).post('/auth/register').send({
      email: 'test@test.com',
      nickname: 'tester',
      password: 'qwer1234',
      image: 'test.jpg',
    });
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  // ---------------------------------------------------------
  // 1. Create Register
  // ---------------------------------------------------------
  describe('회원가입 : POST /auth/register', () => {
    test('회원가입 성공', async () => {
      const response = await request(app).post('/auth/register').send({
        email: 'kjs@test.com',
        nickname: 'kjs1212',
        password: 'qwer1234',
        image: 'test.jpg',
      });

      expect(response.status).toBe(201);
    });

    test('회원가입 실패 : 이메일 누락', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ email: '', nickname: 'kjs', password: 'qwer1234', image: 'test.jpg' });

      expect(response.status).toBe(400);
    });

    test('회원가입 실패 : 이메일 형식 오류', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ email: 'kjs', nickname: 'kjs', password: 'qwer1234', image: 'test.jpg' });

      expect(response.status).toBe(400);
    });

    test('회원가입 실패 : 닉네임 누락', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ email: 'kjs@test.com', nickname: '', password: 'qwer1234', image: 'test.jpg' });

      expect(response.status).toBe(400);
    });

    test('회원가입 실패 : 패스워드 없음', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ email: 'kjs@test.com', nickname: 'kjs', password: '', image: 'test.jpg' });

      expect(response.status).toBe(400);
    });

    test('회원가입 실패 : 이메일 중복', async () => {
      // 기본 회원가입 정보 입력
      await request(app).post('/auth/register').send({
        email: 'kjs1@test.com',
        nickname: 'kjsNew',
        password: 'qwer1234',
        image: 'test.jpg',
      });

      const response = await request(app).post('/auth/register').send({
        email: 'kjs1@test.com',
        nickname: 'kjsRe',
        password: 'qwer1234',
        image: 'test.jpg',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists');
    });
  });

  // ---------------------------------------------------------
  // 2. Login
  // ---------------------------------------------------------
  describe('로그인 : POST /auth/login', () => {
    test('로그인 성공', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@test.com', password: 'qwer1234' });

      expect(response.status).toBe(200);
      expect(response.header['set-cookie'][0]).toMatch(/access-token=/);
    });

    test('로그인 실패 : 이메일 오류', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test', password: 'qwer1234' });

      expect(response.status).toBe(400);
    });

    test('로그인 실패 : 이메일 누락', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: '', password: 'qwer1234' });

      expect(response.status).toBe(400);
    });

    test('로그인 실패 : 잘못된 이메일 사용', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test1234@test.com', password: 'qwer1234' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid credentials');
    });

    test('로그인 실패 : 패스워드 누락', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@test.com', password: '' });

      expect(response.status).toBe(400);
    });

    test('로그인 실패 : 패스워드 오류', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@test.com', password: 'qwer123456' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  // ---------------------------------------------------------
  // 3. Logout
  // ---------------------------------------------------------
  describe('로그아웃 : POST /logout', () => {
    test('로그아웃 성공', async () => {
      const response = await request(app).post('/auth/logout');

      expect(response.status).toBe(200);
      expect(response.header['set-cookie'][0]).toEqual(
        'access-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      );
    });
  });

  // 개별 심화
  // describe('토큰 재발행 : POST /refresh', () => {});
});
