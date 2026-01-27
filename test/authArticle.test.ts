import request from 'supertest';
import { prismaClient } from '@lib/prismaClient';
import app from '@/app';

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
    await request(app).post('/auth/register').send({
      email: 'test@test.com',
      nickname: 'tester',
      password: 'qwer1234',
      image: 'test.jpg',
    });

    await request(app).post('/auth/register').send({
      email: 'test2@test.com',
      nickname: 'tester2',
      password: 'qwer1234',
      image: 'test.jpg',
    });
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  describe('인증을 거친 후 게시글 생성 POST /articles', () => {
    test('신규 게시글 작성 : title, content, image', async () => {
      const agent = request.agent(app);

      const user = await agent
        .post('/auth/login')
        .send({ email: 'test@test.com', password: 'qwer1234' });

      expect(user.status).toBe(200);

      const articleResponse = await agent.post('/articles').send({
        title: '신규 게시글',
        content: '첫번째 게시글 입니다',
        image: 'img.jpg',
        // userID의 경우 agent의 토큰으로 자동 변환 되므로 전달 불필요
      });

      expect(articleResponse.status).toBe(201);
    });

    test('신규 게시글 작성 : image null', async () => {
      const agent = request.agent(app);

      const user = await agent
        .post('/auth/login')
        .send({ email: 'test@test.com', password: 'qwer1234' });

      expect(user.status).toBe(200);

      const articleResponse = await agent.post('/articles').send({
        title: '신규 게시글 2',
        content: '이미지가 없는 게시글 입니다',
      });
    });
  });

  // describe('인증을 거친 후 게시글 목록 조회 GET /articles', () => {});
  // describe('인증을 거친 후 게시글 상세 조회 GET /articles/:id', () => {});

  describe('인증을 거친 후 게시글 수정 PATCH /articles/:id', () => {
    test('게시글 수정 : title', async () => {
      const agent = request.agent(app);
      await agent.post('/auth/login').send({ email: 'test@test.com', password: 'qwer1234' });

      const user = await prismaClient.user.findUnique({ where: { email: 'test@test.com' } });
      const article = await prismaClient.article.create({
        data: { title: '게시글', content: '내용', userId: user!.id },
      });

      const updateResponse = await agent
        .patch(`/articles/${article.id}`)
        .send({ title: '게시글 수정' });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.title).toBe('게시글 수정');
    });

    test('게시글 수정 : content', async () => {
      const agent = request.agent(app);
      await agent.post('/auth/login').send({ email: 'test@test.com', password: 'qwer1234' });

      const user = await prismaClient.user.findUnique({ where: { email: 'test@test.com' } });
      const article = await prismaClient.article.create({
        data: { title: '게시글', content: '내용', userId: user!.id },
      });

      const updateResponse = await agent
        .patch(`/articles/${article.id}`)
        .send({ content: '내용 수정' });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.content).toBe('내용 수정');
    });

    test('게시글 수정 : image', async () => {
      const agent = request.agent(app);
      await agent.post('/auth/login').send({ email: 'test@test.com', password: 'qwer1234' });

      const user = await prismaClient.user.findUnique({ where: { email: 'test@test.com' } });
      const article = await prismaClient.article.create({
        data: { title: '게시글', content: '내용', image: 'img.jpg', userId: user!.id },
      });

      const updateResponse = await agent
        .patch(`/articles/${article.id}`)
        .send({ image: 'img123.jpg' });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.image).toBe('img123.jpg');
    });

    test('게시글 수정 불가 : 잘못된 게시글 id', async () => {
      const agent = request.agent(app);
      await agent.post('/auth/login').send({ email: 'test@test.com', password: 'qwer1234' });

      const user = await prismaClient.user.findUnique({ where: { email: 'test@test.com' } });

      const article = await prismaClient.article.create({
        data: { title: '게시글', content: '내용', userId: user!.id },
      });

      const updateResponse = await agent
        .patch(`/articles/${article.id + 1}`)
        .send({ title: '게시글 id 오류' });

      expect(updateResponse.status).toBe(404);
      expect(updateResponse.body.message).toBe(`article with id ${article.id + 1} not found`);
    });

    test('게시글 수정 불가 : 다른 로그인 사용자', async () => {
      const agent = request.agent(app);
      await agent.post('/auth/login').send({ email: 'test@test.com', password: 'qwer1234' });

      const user = await prismaClient.user.findUnique({ where: { email: 'test@test.com' } });
      const article = await prismaClient.article.create({
        data: { title: '게시글', content: '내용', userId: user!.id },
      });

      await agent.post('/auth/logout');

      // 다른 사용자로 로그인
      await agent.post('/auth/login').send({ email: 'test2@test.com', password: 'qwer1234' });

      const updateResponse = await agent
        .patch(`/articles/${article.id}`)
        .send({ title: '다른사람' });

      expect(updateResponse.status).toBe(403);
      expect(updateResponse.body.message).toBe('Should be the owner of the article');
    });
  });

  describe('인증을 거친 후 게시글 삭제 DELETE /articles/:id', () => {
    test('게시글 삭제', async () => {
      const agent = request.agent(app);
      await agent.post('/auth/login').send({ email: 'test@test.com', password: 'qwer1234' });

      const user = await prismaClient.user.findUnique({ where: { email: 'test@test.com' } });
      const article = await prismaClient.article.create({
        data: { title: '게시글', content: '내용', image: 'img.jpg', userId: user!.id },
      });

      const deleteResponse = await agent.delete(`/articles/${article.id}`);

      expect(deleteResponse.status).toBe(204);
    });

    test('게시글 삭제 불가 : 잘못된 게시글 id', async () => {
      const agent = request.agent(app);
      await agent.post('/auth/login').send({ email: 'test@test.com', password: 'qwer1234' });

      const user = await prismaClient.user.findUnique({ where: { email: 'test@test.com' } });
      const article = await prismaClient.article.create({
        data: { title: '게시글', content: '내용', image: 'img.jpg', userId: user!.id },
      });

      const deleteResponse = await agent.delete(`/articles/${article.id + 1}`);

      expect(deleteResponse.status).toBe(404);
      expect(deleteResponse.body.message).toBe(`article with id ${article.id + 1} not found`);
    });

    test('게시글 삭제 불가 : 다른 로그인 사용자', async () => {
      const agent = request.agent(app);
      await agent.post('/auth/login').send({ email: 'test@test.com', password: 'qwer1234' });

      const user = await prismaClient.user.findUnique({ where: { email: 'test@test.com' } });
      const article = await prismaClient.article.create({
        data: { title: '게시글', content: '내용', image: 'img.jpg', userId: user!.id },
      });

      await agent.post('/auth/logout');

      // 다른 사용자로 로그인
      await agent.post('/auth/login').send({ email: 'test2@test.com', password: 'qwer1234' });

      const deleteResponse = await agent.delete(`/articles/${article.id}`);

      expect(deleteResponse.status).toBe(403);
      expect(deleteResponse.body.message).toBe('Should be the owner of the article');
    });
  });

  // 개별 심화
  // describe('인증을 거친 후 게시글에 댓글 생성 POST /articles', () => {});
  // describe('인증을 거친 후 게시글에 "좋아요" 설정 POST /articles', () => {});
  // describe('인증을 거친 후 게시글에 "좋아요" 취소 DELETE /articles', () => {});
});
