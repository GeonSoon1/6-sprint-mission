import request from 'supertest';
import app from '../src/app';

describe('인증이 필요한 상품 API 테스트', () => {
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

  test('POST /products - 상품 등록 성공', async () => {
    const newProduct = {
      name: '테스트 상품',
      description: '설명',
      price: 10000,
      stock: 4,
      category: 'FASHION',
      status: 'ON_SALE',
    };

    const res = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(newProduct);

    console.log('상품 등록 응답:', res.body);
    expect(res.status).toBe(201);
  });
});
