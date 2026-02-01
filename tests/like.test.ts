import request from 'supertest';
import app from '../src/app';
import prisma from '../src/libs/prismaClient';

describe('Like 통합 테스트 (Product & Article)', () => {
  let userToken: string;
  let productId: string;
  let articleId: string;

  beforeAll(async () => {
    await prisma.comment.deleteMany();
    await prisma.article.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    await request(app).post('/users/registration').send({
      email: 'liker@example.com',
      nickname: '좋아요러',
      password: 'password123',
    });

    const res = await request(app).post('/users/login').send({
      email: 'liker@example.com',
      password: 'password123',
    });
    const cookies = res.headers['set-cookie'] as unknown as string[];
    userToken = cookies.join(';');

    const pRes = await request(app)
      .post('/products')
      .set('Cookie', userToken)
      .send({
        name: '좋아요 상품',
        description: '설명',
        price: 1000,
        tags: [],
      });
    productId = pRes.body.id;

    const aRes = await request(app)
      .post('/articles')
      .set('Cookie', userToken)
      .send({
        title: '좋아요 게시글',
        content: '내용',
      });
    articleId = aRes.body.id;
  });

  afterAll(async () => {
    await prisma.product.deleteMany();
    await prisma.article.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /users/products/:productId', () => {
    test('상품 좋아요 등록 성공 (200/201)', async () => {
      const res = await request(app)
        .post(`/users/products/${productId}`)
        .set('Cookie', userToken);

      expect([200, 201]).toContain(res.status);
      expect(res.body).toHaveProperty('message');
    });

    test('상품 좋아요 해제 성공 (200/201/204)', async () => {
      const res = await request(app)
        .post(`/users/products/${productId}`)
        .set('Cookie', userToken);

      expect([200, 201, 204]).toContain(res.status);
    });
  });

  describe('POST /users/articles/:articleId', () => {
    test('게시글 좋아요 등록 성공 (200/201)', async () => {
      const res = await request(app)
        .post(`/users/articles/${articleId}`)
        .set('Cookie', userToken);

      expect([200, 201]).toContain(res.status);
    });

    test('게시글 좋아요 해제 성공 (200/201/204)', async () => {
      const res = await request(app)
        .post(`/users/articles/${articleId}`)
        .set('Cookie', userToken);

      expect([200, 201, 204]).toContain(res.status);
    });
  });
});
