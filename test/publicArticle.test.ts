import request from 'supertest';
import { prismaClient } from '@lib/prismaClient';
import app from '@/app';
import { userSample, articleSample } from '@test/helper/mockdata';
import { createArticlesWithUsers } from '@test/helper/article';

describe('인증이 필요하지 않은 게시글 API 통합 테스트', () => {
  console.log('public article run!!');

  beforeAll(async () => {
    // DB 데이터 삭제는 가장 관계 설정이 적은 단위부터 시행
    await prismaClient.notification.deleteMany();
    await prismaClient.like.deleteMany();
    await prismaClient.favorite.deleteMany();
    await prismaClient.comment.deleteMany();
    await prismaClient.product.deleteMany();
  });

  beforeEach(async () => {
    await prismaClient.article.deleteMany();
    await prismaClient.user.deleteMany();
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  describe('인증 없이 게시글 리스트 조회 GET /articles', () => {
    test('게시글이 없는 경우 빈 배열 반환', async () => {
      const response = await request(app).get('/articles');
      expect(response.status).toBe(200);
      expect(response.body.list).toEqual([]);
      expect(response.body.totalCount).toBe(0);
    });

    test('게시글이 있고, query가 없는 경우 모든 데이터 반환', async () => {
      await createArticlesWithUsers(userSample, articleSample);

      const response = await request(app).get('/articles');

      expect(response.status).toBe(200);
      expect(response.body.list.length).toBe(10);
      expect(response.body.totalCount).toBe(10);
      expect(response.body.list[0].title).toBe('게시판 이용 수칙 안내');
    });

    test('query : Page / PageSize 테스트', async () => {
      await createArticlesWithUsers(userSample, articleSample);

      const response = await request(app).get('/articles').query({ page: 2, pageSize: 3 });

      expect(response.status).toBe(200);
      expect(response.body.list.length).toBe(3);
      expect(response.body.list[0].title).toBe('주말에 아이랑 갈만한 곳');
    });

    test('query : orderBy 테스트', async () => {
      await createArticlesWithUsers(userSample, articleSample);

      const response = await request(app).get('/articles').query({ orderBy: 'oldest' });

      expect(response.status).toBe(200);
      expect(response.body.list[0].title).toBe('게시판 이용 수칙 안내');
    });

    test('query : keyword 테스트', async () => {
      await createArticlesWithUsers(userSample, articleSample);

      const response1 = await request(app).get('/articles').query({ keyword: '판다마켓' });

      expect(response1.status).toBe(200);
      expect(response1.body.list.length).toBe(1);

      const response2 = await request(app).get('/articles').query({ keyword: '불량마켓' });

      expect(response2.status).toBe(200);
      expect(response2.body.list.length).toBe(0);
    });
  });

  describe('인증 없이 게시글 상세 조회 GET /articles/:id', () => {
    test('인증 없이 게시글 상세 조회', async () => {
      const user = await prismaClient.user.create({ data: userSample[0] });
      const article = await prismaClient.article.create({
        data: {
          ...articleSample[0],
          userId: user.id,
        },
      });

      const response = await request(app).get(`/articles/${article.id}`);
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('게시판 이용 수칙 안내');
    });

    test('존재하지 않는 게시글 상세 조회', async () => {
      const user = await prismaClient.user.create({ data: userSample[0] });
      const article = await prismaClient.article.create({
        data: {
          ...articleSample[0],
          userId: user.id,
        },
      });

      const response = await request(app).get(`/articles/${article.id + 1}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`article with id ${article.id + 1} not found`);
    });
  });
});
