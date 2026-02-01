import request from 'supertest';
import app from '../src/app';
import prisma from '../src/libs/prismaClient';

describe('Validation Error 통합 테스트 (400 Bad Request)', () => {
  let userToken: string;
  let uniqueEmail: string;

  beforeAll(async () => {
    uniqueEmail = `validation_${Date.now()}@example.com`;
    await request(app).post('/users/registration').send({
      email: uniqueEmail,
      nickname: '밸리데이션',
      password: 'password123',
    });

    const res = await request(app).post('/users/login').send({
      email: uniqueEmail,
      password: 'password123',
    });
    const cookies = res.headers['set-cookie'] as unknown as string[];
    userToken = cookies.join(';');
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  test('POST /articles - 제목 누락 시 400 반환', async () => {
    const res = await request(app)
      .post('/articles')
      .set('Cookie', userToken)
      .send({
        content: '내용만 있음',
      });
    expect(res.status).toBe(400);
  });

  test('POST /articles - 잘못된 필드 타입 시 400 반환', async () => {
    const res = await request(app)
      .post('/articles')
      .set('Cookie', userToken)
      .send({
        title: 12345,
        content: '내용',
      });
    expect(res.status).toBe(400);
  });

  test('POST /products - 가격이 문자열일 때 400 반환', async () => {
    const res = await request(app)
      .post('/products')
      .set('Cookie', userToken)
      .send({
        name: '상품',
        description: '설명',
        price: '천원',
        tags: [],
      });
    expect(res.status).toBe(400);
  });

  test('POST /users/registration - 이메일 형식 오류 시 400 반환', async () => {
    const res = await request(app).post('/users/registration').send({
      email: 'not-an-email',
      nickname: '닉네임',
      password: 'password123',
    });
    expect(res.status).toBe(400);
  });

  test('POST /users/login - 비밀번호 누락 시 400 반환', async () => {
    const res = await request(app).post('/users/login').send({
      email: uniqueEmail,
    });
    expect(res.status).toBe(400);
  });

  test('GET /articles/:id - 잘못된 ID 형식 시 400 반환', async () => {
    const res = await request(app).get('/articles/invalid-uuid');
    expect(res.status).toBe(400);
  });

  test('PATCH /comments/:commentId - 댓글 내용 누락 시 400 반환', async () => {
    const res = await request(app)
      .patch('/comments/some-uuid')
      .set('Cookie', userToken)
      .send({});
    expect(res.status).toBe(400);
  });

  test('GET /articles - 잘못된 정렬 기준 시 400 반환', async () => {
    const res = await request(app).get('/articles?sort=invalid');
    expect(res.status).toBe(400);
  });

  test('POST /articles - 제목 길이(30자) 초과 시 400 반환', async () => {
    const longTitle = 'a'.repeat(31);
    const res = await request(app)
      .post('/articles')
      .set('Cookie', userToken)
      .send({
        title: longTitle,
        content: 'content',
      });
    expect(res.status).toBe(400);
  });

  test('GET /products - page, limit, skip에 문자열 입력 시 Coercion 동작 (200 반환)', async () => {
    const res = await request(app).get('/products?page=abc&limit=abc&skip=abc');
    expect(res.status).toBe(200);
  });

  test('GET /products - description 검색어 길이 초과 시 400 반환 (Optional이지만 길이 체크)', async () => {
    const longSearch = 'a'.repeat(51);
    const res = await request(app).get(`/products?search=${longSearch}`);
    expect(res.status).toBe(400);
  });

  test('PATCH /products/:id - 잘못된 가격 형식 (문자열) 시 400 반환', async () => {
    const res = await request(app)
      .patch('/products/some-uuid')
      .set('Cookie', userToken)
      .send({
        price: '천원',
      });
    expect(res.status).toBe(400);
  });

  test('GET /articles - page, limit에 문자열 입력 시 Coercion 동작 (200 반환)', async () => {
    const res = await request(app).get('/articles?page=abc&limit=abc');
    expect(res.status).toBe(200);
  });

  test('PATCH /articles/:id - title 길이 초과 시 400 반환', async () => {
    const longTitle = 'a'.repeat(31);
    const res = await request(app)
      .patch('/articles/some-uuid')
      .set('Cookie', userToken)
      .send({
        title: longTitle,
        content: 'content',
      });
    expect(res.status).toBe(400);
  });

  test('GET /comments/article/:articleId - Cursor 유효성 검사', async () => {
    const validUuid = 'f7f03c26-4763-4a9f-8abe-cf9e1079af7d';
    const res = await request(app).get(
      `/comments/article/${validUuid}?cursor=invalid-uuid`
    );
    expect(res.status).toBe(400);
  });

  test('GET /comments/article/:articleId - Limit 파라미터 형변환 확인', async () => {
    const validUuid = 'f7f03c26-4763-4a9f-8abe-cf9e1079af7d';
    const res = await request(app).get(
      `/comments/article/${validUuid}?limit=abc`
    );
    expect(res.status).toBe(200);
  });

  test('GET /notifications - Limit 파라미터 형변환 확인', async () => {
    const res = await request(app)
      .get('/notifications?limit=abc')
      .set('Cookie', userToken);
    expect(res.status).toBe(200);
  });
});
