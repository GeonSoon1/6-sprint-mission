import request from 'supertest';
import app from '../src/app';
import prisma from '../src/libs/prismaClient';

describe('Product 통합 테스트', () => {
  let userToken: string;
  let productId: string;

  beforeAll(async () => {
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    await request(app).post('/users/registration').send({
      email: 'test@example.com',
      nickname: '판매자',
      password: 'password123',
    });

    const res = await request(app).post('/users/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    const cookies = res.headers['set-cookie'] as unknown as string[];
    const accessTokenCookie = cookies.find((c) => c.startsWith('accessToken='));
    expect(accessTokenCookie).toBeDefined();

    userToken = cookies.join(';');
  });

  afterAll(async () => {
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /products', () => {
    test('상품 생성 성공 (201)', async () => {
      const res = await request(app)
        .post('/products')
        .set('Cookie', userToken)
        .send({
          name: '테스트 상품',
          description: '멋진 상품입니다.',
          price: 10000,
          tags: ['new', 'sale'],
        });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('테스트 상품');
      productId = res.body.id;
    });

    test('상품 생성 실패 = 인증 없음 (401)', async () => {
      const res = await request(app).post('/products').send({
        name: '인증없는 상품',
        description: '실패해야 함',
        price: 5000,
        tags: [],
      });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /products', () => {
    test('상품 목록 조회 성공 (200)', async () => {
      const res = await request(app).get('/products');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);

      if (res.body.length > 0) {
        await request(app).get('/products?search=상품').expect(200);
        await request(app).get('/products?sort=oldest').expect(200);
        await request(app).get('/products?page=0&limit=abc').expect(200);
      }
    });
  });

  describe('GET /products/:id', () => {
    test('상품 상제 조회 성공 (200)', async () => {
      const res = await request(app).get(`/products/${productId}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(productId);
    });

    test('상품 상세 조회 실패 - 없는 ID (404)', async () => {
      const res = await request(app).get(
        '/products/11111111-1111-4111-8111-111111111111'
      );
      expect(res.status).not.toBe(200);
    });
  });

  describe('PATCH /products/:id', () => {
    test('상품 수정 성공 (200)', async () => {
      const res = await request(app)
        .patch(`/products/${productId}`)
        .set('Cookie', userToken)
        .send({
          name: '수정된 상품명',
          price: 20000,
        });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('수정된 상품명');
    });
  });

  describe('DELETE /products/:id', () => {
    test('상품 삭제 성공 (204)', async () => {
      const res = await request(app)
        .delete(`/products/${productId}`)
        .set('Cookie', userToken);

      expect(res.status).toBe(204);
    });
  });
});
