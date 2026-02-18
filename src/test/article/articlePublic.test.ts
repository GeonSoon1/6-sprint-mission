import request from 'supertest';
import app from '../../app';
import prisma from '../../lib/prisma';

describe('게시글 API 인증 불필요', () => {
  test('GET /articles - 게시글이 없을 때 빈 배열 조회', async () => {
    const response = await request(app).get('/articles');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
  test('GET /articles - 게시글 목록 조회', async () => {
    // 유저 1개 생성
    const user = await prisma.user.create({
      data: {
        nickname: 'user1',
        password: 'password',
        email: 'user@example.com',
      },
    });
    // 먼저 몇 개의 게시글을 생성
    await prisma.article.createMany({
      data: [
        {
          title: 'Article 1',
          content: 'Content for article 1',
          userId: user.id,
        },
        {
          title: 'Article 2',
          content: 'Content for article 2',
          userId: user.id,
        },
      ],
    });
    const response = await request(app).get('/articles');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty('title', 'Article 1');
    expect(response.body[1]).toHaveProperty('title', 'Article 2');
  });
  //파라미터 필터링
  test('GET /articles - 파라미터에 따라 필터링', async () => {
    // 유저 1개 생성
    const user = await prisma.user.create({
      data: {
        nickname: 'user1',
        password: 'password',
        email: 'user@example.com',
      },
    });
    // 게시글 2개 생성
    await prisma.article.createMany({
      data: [
        {
          title: 'Article 1',
          content: 'Content for article 1',
          userId: user.id,
        },
        {
          title: 'Article 2',
          content: 'Content for article 2',
          userId: user.id,
        },
      ],
    });
    const response = await request(app).get('/articles?search=Article 1');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty('title', 'Article 1');
  });

  //정렬
  test('GET /articles - oldest 정렬', async () => {
    // 유저 1개 생성
    const user = await prisma.user.create({
      data: {
        nickname: 'user1',
        password: 'password',
        email: 'user@example.com',
      },
    });
    // 게시글 2개 생성
    const article1 = await prisma.article.create({
      data: {
        title: 'Article 1',
        content: 'Content for article 1',
        userId: user.id,
      },
    });
    // 잠시 대기
    await new Promise((resolve) => setTimeout(resolve, 100));
    const article2 = await prisma.article.create({
      data: {
        title: 'Article 2',
        content: 'Content for article 2',
        userId: user.id,
      },
    });

    const response = await request(app).get('/articles?order=oldest');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].id).toBe(article1.id);
    expect(response.body[1].id).toBe(article2.id);
  });

  //특정 게시글 조회
  test('GET /articles/:id - 특정 게시글 조회', async () => {
    // 유저 1개 생성
    const user = await prisma.user.create({
      data: {
        nickname: 'user1',
        password: 'password',
        email: 'user@example.com',
      },
    });
    // 게시글 1개 생성
    const article = await prisma.article.create({
      data: {
        title: 'Article 1',
        content: 'Content for article 1',
        userId: user.id,
      },
    });
    const response = await request(app).get(`/articles/${article.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('title', 'Article 1');
    expect(response.body).toHaveProperty('content', 'Content for article 1');
  });
});
