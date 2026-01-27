import request from 'supertest';
import { prismaClient } from '@lib/prismaClient';
import app from '@/app';
import { userSample, articleSample } from '@test/helper/mockdata';
import { createArticlesWithUsers } from '@test/helper/article';

const agent1 = request.agent(app);
const agent2 = request.agent(app);

describe('인증이 필요한 게시글 API 통합 테스트', () => {
  console.log('auth article run!!');

  beforeAll(async () => {
    await prismaClient.notification.deleteMany();
    await prismaClient.favorite.deleteMany();
    await prismaClient.product.deleteMany();
  });

  beforeEach(async () => {
    await prismaClient.like.deleteMany();
    await prismaClient.comment.deleteMany();
    await prismaClient.article.deleteMany();
    await prismaClient.user.deleteMany();

    // 사용자 식별 테스트를 위하여 임의로 user data 2개 입력
    await agent1.post('/auth/register').send({
      email: 'test1@agent.com',
      nickname: 'tester',
      password: 'qwer1234',
      image: 'test.jpg',
    });

    await agent1.post('/auth/login').send({ email: 'test1@agent.com', password: 'qwer1234' });

    await agent2.post('/auth/register').send({
      email: 'test2@agent.com',
      nickname: 'tester2',
      password: 'qwer1234',
      image: 'test.jpg',
    });

    await agent2.post('/auth/login').send({ email: 'test2@agent.com', password: 'qwer1234' });
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  describe('인증을 거친 후 게시글 생성 POST /articles', () => {
    test('신규 게시글 작성 : title, content, image', async () => {
      const createResponse = await agent1.post('/articles').send({
        title: '신규 게시글',
        content: '첫번째 게시글 입니다',
        image: 'img.jpg',
        // userID의 경우 agent의 토큰으로 자동 변환 되므로 전달 불필요
      });

      expect(createResponse.status).toBe(201);
      expect(createResponse.body.title).toBe('신규 게시글');
    });

    test('신규 게시글 작성 : image null', async () => {
      const createResponse = await agent1.post('/articles').send({
        title: '신규 게시글 2',
        content: '이미지가 없는 게시글 입니다',
        image: '',
      });

      expect(createResponse.status).toBe(201);
      expect(createResponse.body.title).toBe('신규 게시글 2');
    });

    test('신규 게시글 필수값 누락 : title', async () => {
      const createResponse = await agent1.post('/articles').send({
        title: '',
        content: '첫번째 게시글 입니다',
        image: 'img.jpg',
      });

      expect(createResponse.status).toBe(400);
    });

    test('신규 게시글 필수값 누락 : title', async () => {
      const createResponse = await agent1.post('/articles').send({
        title: '신규 게시글',
        content: '',
        image: 'img.jpg',
      });

      expect(createResponse.status).toBe(400);
    });
  });

  describe('인증을 거친 후 게시글 목록 조회 GET /articles', () => {
    test('게시글이 없는 경우, 빈 배열 반환', async () => {
      const getResponse = await agent1.get('/articles');

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.list).toEqual([]);
      expect(getResponse.body.totalCount).toBe(0);
    });

    test('게시글이 있는 경우, 전체 목록 조회', async () => {
      await createArticlesWithUsers(userSample, articleSample);

      const getResponse = await agent1.get('/articles');

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.list.length).toBe(10);
      expect(getResponse.body.totalCount).toBe(10);
    });

    // 상세 쿼리 테스트 생략..
  });

  describe('인증을 거친 후 게시글 상세 조회 GET /articles/:id', () => {
    test('생성자와 관계 없이 상세 조회 가능', async () => {
      const article = await agent1
        .post('/articles')
        .send({ title: '게시글', content: '내용', image: 'img.jpg' });

      const getResponse = await agent2.get(`/articles/${article.body.id}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.title).toBe('게시글');
    });

    test('존재하지 않는 게시글 상세 조회', async () => {
      const article = await agent1
        .post('/articles')
        .send({ title: '게시글', content: '내용', image: 'img.jpg' });

      const getResponse = await agent1.get(`/articles/${article.body.id + 1}`);

      expect(getResponse.status).toBe(404);
      expect(getResponse.body.message).toBe(`article with id ${article.body.id + 1} not found`);
    });
  });

  describe('인증을 거친 후 게시글 수정 PATCH /articles/:id', () => {
    test('게시글 수정 : title', async () => {
      const article = await agent1
        .post('/articles')
        .send({ title: '게시글', content: '내용', image: 'img.jpg' });

      const updateResponse = await agent1
        .patch(`/articles/${article.body.id}`)
        .send({ title: '게시글 수정' });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.title).toBe('게시글 수정');
    });

    test('게시글 수정 : content', async () => {
      const article = await agent1
        .post('/articles')
        .send({ title: '게시글', content: '내용', image: 'img.jpg' });

      const updateResponse = await agent1
        .patch(`/articles/${article.body.id}`)
        .send({ content: '내용 수정' });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.content).toBe('내용 수정');
    });

    test('게시글 수정 : image', async () => {
      const article = await agent1
        .post('/articles')
        .send({ title: '게시글', content: '내용', image: 'img.jpg' });

      const updateResponse = await agent1
        .patch(`/articles/${article.body.id}`)
        .send({ image: 'img123.jpg' });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.image).toBe('img123.jpg');
    });

    test('게시글 수정 불가 : 잘못된 게시글 id', async () => {
      const article = await agent1
        .post('/articles')
        .send({ title: '게시글', content: '내용', image: 'img.jpg' });

      const updateResponse = await agent1
        .patch(`/articles/${article.body.id + 1}`)
        .send({ title: '게시글 id 오류' });

      expect(updateResponse.status).toBe(404);
      expect(updateResponse.body.message).toBe(`article with id ${article.body.id + 1} not found`);
    });

    test('게시글 수정 불가 : 현재 글을 작성하지 않은 다른 사용자', async () => {
      const article = await agent1
        .post('/articles')
        .send({ title: '게시글', content: '내용', image: 'img.jpg' });

      // 다른 사용자(agent2)로 게시글 수정
      const updateResponse = await agent2
        .patch(`/articles/${article.body.id}`)
        .send({ title: '다른사람' });

      expect(updateResponse.status).toBe(403);
      expect(updateResponse.body.message).toBe('Should be the owner of the article');
    });
  });

  describe('인증을 거친 후 게시글 삭제 DELETE /articles/:id', () => {
    test('게시글 삭제', async () => {
      const article = await agent1
        .post('/articles')
        .send({ title: '게시글', content: '내용', image: 'img.jpg' });

      const deleteResponse = await agent1.delete(`/articles/${article.body.id}`);

      expect(deleteResponse.status).toBe(204);
    });

    test('게시글 삭제 불가 : 잘못된 게시글 id', async () => {
      const article = await agent1
        .post('/articles')
        .send({ title: '게시글', content: '내용', image: 'img.jpg' });

      const deleteResponse = await agent1.delete(`/articles/${article.body.id + 1}`);

      expect(deleteResponse.status).toBe(404);
      expect(deleteResponse.body.message).toBe(`article with id ${article.body.id + 1} not found`);
    });

    test('게시글 삭제 불가 : 현재 글을 작성하지 않은 다른 사용자', async () => {
      const article = await agent1
        .post('/articles')
        .send({ title: '게시글', content: '내용', image: 'img.jpg' });

      // 다른 사용자(agent2)로 게시글 삭제
      const deleteResponse = await agent2.delete(`/articles/${article.body.id}`);

      expect(deleteResponse.status).toBe(403);
      expect(deleteResponse.body.message).toBe('Should be the owner of the article');
    });
  });

  // 개별 심화
  // describe('인증을 거친 후 게시글에 댓글 생성 POST /articles', () => {});
  // describe('인증을 거친 후 게시글에 "좋아요" 설정 POST /articles', () => {});
  // describe('인증을 거친 후 게시글에 "좋아요" 취소 DELETE /articles', () => {});
});
