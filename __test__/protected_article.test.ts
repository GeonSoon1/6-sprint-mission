import request from 'supertest';
import app from '../src/app';

describe('인증이 필요한 게시글 API 테스트', () => {
  let accessToken: string;

  beforeAll(async () => {
    const uniqueId = Date.now();

    const user = {
      email: `seller${uniqueId}@test.com`,
      password: 'password1234',
      nickname: `Seller${uniqueId}`,
    };

    await request(app).post('/auth/signup').send(user);

    const loginRes = await request(app).post('/auth/login').send({
      email: user.email,
      password: user.password,
    });

    accessToken = loginRes.body.accessToken;
  });

  test('POST /articles - 게시물 등록 성공', async () => {
    const newArticle = {
      title: '테스트 게시물',
      content: '테스트 게시물 내용',
    };

    const res = await request(app)
      .post('/articles')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(newArticle);

    console.log('게시물 등록 응답:', res.body);
    expect(res.status).toBe(201);
  });

  test('POST /articles - 토큰 없이 요청시 401 반환', async () => {});
});
