import request from 'supertest';
import app from '../src/app';
import prisma from '../src/libs/prismaClient';

describe('Comment 통합 테스트', () => {
  let userToken: string;
  let articleId: string;
  let productId: string;
  let commentId: string;

  beforeAll(async () => {
    await prisma.comment.deleteMany();
    await prisma.article.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    await request(app).post('/users/registration').send({
      email: 'commenter@example.com',
      nickname: '댓글러',
      password: 'password123',
    });

    const res = await request(app).post('/users/login').send({
      email: 'commenter@example.com',
      password: 'password123',
    });

    const cookies = res.headers['set-cookie'] as unknown as string[];
    userToken = cookies.join(';');

    const articleRes = await request(app)
      .post('/articles')
      .set('Cookie', userToken)
      .send({
        title: '댓글 테스트용 게시글',
        content: '내용',
      });
    articleId = articleRes.body.id;

    const productRes = await request(app)
      .post('/products')
      .set('Cookie', userToken)
      .send({
        name: '댓글 테스트용 상품',
        description: '설명',
        price: 1000,
        tags: [],
      });
    productId = productRes.body.id;
  });

  afterAll(async () => {
    await prisma.comment.deleteMany();
    await prisma.article.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /comments/article/:articleId', () => {
    test('게시글 댓글 생성 성공 (201)', async () => {
      const res = await request(app)
        .post(`/comments/article/${articleId}`)
        .set('Cookie', userToken)
        .send({
          content: '게시글 댓글입니다.',
        });

      expect(res.status).toBe(201);
      expect(res.body.content).toBe('게시글 댓글입니다.');
      commentId = res.body.id;
    });
  });

  describe('POST /comments/product/:productId', () => {
    test('상품 댓글 생성 성공 (201)', async () => {
      const res = await request(app)
        .post(`/comments/product/${productId}`)
        .set('Cookie', userToken)
        .send({
          content: '상품 댓글입니다.',
        });

      expect(res.status).toBe(201);
      expect(res.body.content).toBe('상품 댓글입니다.');
    });
  });

  describe('GET /comments/article/:articleId', () => {
    test('게시글 댓글 목록 조회 성공 (200)', async () => {
      const res = await request(app).get(`/comments/article/${articleId}`);
      expect(res.status).toBe(200);
      const list = res.body.list || res.body;
      expect(Array.isArray(list)).toBe(true);

      await request(app)
        .get(`/comments/article/${articleId}?limit=abc`)
        .expect(200);
    });
  });

  describe('PATCH /comments/:id', () => {
    test('댓글 수정 성공 (200)', async () => {
      const res = await request(app)
        .patch(`/comments/${commentId}`)
        .set('Cookie', userToken)
        .send({
          content: '수정된 댓글입니다.',
        });

      expect(res.status).toBe(200);
      expect(res.body.content).toBe('수정된 댓글입니다.');
    });
  });

  describe('DELETE /comments/:id', () => {
    test('댓글 삭제 성공 (204)', async () => {
      const res = await request(app)
        .delete(`/comments/${commentId}`)
        .set('Cookie', userToken);

      expect(res.status).toBe(204);
    });
  });
});
