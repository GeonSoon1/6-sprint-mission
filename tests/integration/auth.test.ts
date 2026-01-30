import request from 'supertest';
import { app } from '../../src/app.js';
import * as authService from '../../src/services/authService.js';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '../../src/lib/constants.js';
import BadRequestError from '../../src/lib/errors/BadRequestError.js';

describe('Auth API - 통합 테스트', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('POST /auth/register', () => {
    it('회원가입에 성공하면 사용자 정보를 반환한다', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        nickname: 'tester',
        image: null,
        password: 'hashed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(authService, 'register').mockResolvedValue(mockUser);

      const res = await request(app).post('/auth/register').send({
        email: 'test@example.com',
        nickname: 'tester',
        password: 'password123',
        image: null,
      });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        email: 'test@example.com',
        nickname: 'tester',
      });
      expect(res.body).not.toHaveProperty('password');
      expect(authService.register).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          nickname: 'tester',
        }),
      );
    });

    it('이미 존재하는 이메일로 회원가입 시 400을 반환한다', async () => {
      jest
        .spyOn(authService, 'register')
        .mockRejectedValue(new BadRequestError('User already exists'));

      const res = await request(app).post('/auth/register').send({
        email: 'existing@example.com',
        nickname: 'tester',
        password: 'password123',
        image: null,
      });

      expect(res.status).toBe(400);
    });

    it('필수 필드가 누락되면 400을 반환한다', async () => {
      const res = await request(app).post('/auth/register').send({
        email: 'test@example.com',
        // nickname 누락
      });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    it('로그인에 성공하면 인증 쿠키를 설정한다', async () => {
      jest.spyOn(authService, 'login').mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      const res = await request(app).post('/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(200);
      const setCookie = Array.isArray(res.headers['set-cookie'])
        ? res.headers['set-cookie']
        : [];
      expect(setCookie.join(';')).toContain(`${ACCESS_TOKEN_COOKIE_NAME}=`);
      expect(setCookie.join(';')).toContain(`${REFRESH_TOKEN_COOKIE_NAME}=`);
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('잘못된 자격증명으로 로그인 시 400을 반환한다', async () => {
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new BadRequestError('Invalid credentials'));

      const res = await request(app).post('/auth/login').send({
        email: 'test@example.com',
        password: 'wrong-password',
      });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /auth/logout', () => {
    it('로그아웃 시 인증 쿠키를 제거한다', async () => {
      const res = await request(app).post('/auth/logout');

      expect(res.status).toBe(200);
      const setCookie = Array.isArray(res.headers['set-cookie'])
        ? res.headers['set-cookie']
        : [];
      expect(setCookie.join(';')).toContain(`${ACCESS_TOKEN_COOKIE_NAME}=`);
      expect(setCookie.join(';')).toContain(`${REFRESH_TOKEN_COOKIE_NAME}=`);
    });
  });

  describe('POST /auth/refresh', () => {
    it('리프레시 토큰으로 새로운 액세스 토큰을 발급받는다', async () => {
      jest.spyOn(authService, 'refreshToken').mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });

      const res = await request(app)
        .post('/auth/refresh')
        .set('Cookie', [`${REFRESH_TOKEN_COOKIE_NAME}=old-refresh-token`]);

      expect(res.status).toBe(200);
      const setCookie = Array.isArray(res.headers['set-cookie'])
        ? res.headers['set-cookie']
        : [];
      expect(setCookie.join(';')).toContain(`${ACCESS_TOKEN_COOKIE_NAME}=`);
      expect(setCookie.join(';')).toContain(`${REFRESH_TOKEN_COOKIE_NAME}=`);
      expect(authService.refreshToken).toHaveBeenCalled();
    });

    it('리프레시 토큰이 없으면 400을 반환한다', async () => {
      jest
        .spyOn(authService, 'refreshToken')
        .mockRejectedValue(new BadRequestError('Invalid refresh token'));

      const res = await request(app).post('/auth/refresh');

      expect(res.status).toBe(400);
    });
  });
});
