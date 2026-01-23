import request from 'supertest';
import { app } from '../../src/app.js';
import * as authService from '../../src/services/authService.js';

describe('Auth API', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('POST /auth/register returns user', async () => {
    jest.spyOn(authService, 'register').mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      nickname: 'tester',
      image: null,
      password: 'hashed',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await request(app).post('/auth/register').send({
      email: 'test@example.com',
      nickname: 'tester',
      password: 'password',
    });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe('test@example.com');
  });

  it('POST /auth/login sets auth cookies', async () => {
    jest.spyOn(authService, 'login').mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    const res = await request(app).post('/auth/login').send({
      email: 'test@example.com',
      password: 'password',
    });

    expect(res.status).toBe(200);
    const setCookie = Array.isArray(res.headers['set-cookie'])
      ? res.headers['set-cookie']
      : [];
    expect(setCookie.join(';')).toContain('access-token=');
    expect(setCookie.join(';')).toContain('refresh-token=');
  });
});
