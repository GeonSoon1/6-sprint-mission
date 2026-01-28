import request from 'supertest';
import app from '../src/app';

describe('Auth API 통합 테스트', () => {
  const uniqueId = Date.now();
  const testUser = {
    email: `test${uniqueId}@test.com`,
    password: 'password1234',
    nickname: `User${uniqueId}`,
  };

  test('POST /auth/signup - 회원가입 성공', async () => {
    const res = await request(app).post('/auth/signup').send(testUser);
    console.log('회원가입 응답: ', res.body);
    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe(testUser.email);
  });

  test('POST /auth/login - 로그인 성공 및 토큰 발급', async () => {
    const res = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    console.log('로그인 응답: ', res.body);

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });
});
