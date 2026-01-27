import request from 'supertest';
import app from '../../app';
import prisma from '../../lib/prisma';
import bcrypt from 'bcrypt';

describe('게시글 API 인증 필요', () => {
  const agent = request.agent(app); // 상태 유지를 위한 agent 사용
  beforeAll(async () => {
    await prisma.user.deleteMany();
    // 테스트용 유저 생성
    const hashedPassword = await bcrypt.hash('password123', 10);
    // 먼저 유저 생성
    await prisma.user.create({
      data: {
        nickname: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
      },
    });
    await agent.post('/auth/login').send({
      nickname: 'testuser',
      password: 'password123',
    });
  });

  afterEach(async () => {
    await prisma.article.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // 인증된 상태에서 게시글 생성 테스트
  test('POST /articles - 인증된 상태에서 게시글 생성', async () => {
    const response = await agent.post('/articles').send({
      title: 'New Article',
      content: 'This is a new article.',
    });
    expect(response.status).toBe(201);
    expect(response.body.userId).toBeDefined();
    expect(response.body).toHaveProperty('title', 'New Article');
    expect(response.body).toHaveProperty('content', 'This is a new article.');
  });
  // 인증된 상태에서 게시글 수정 테스트
  test('PUT /articles/:id - 인증된 상태에서 게시글 수정', async () => {
    // 먼저 게시글 생성
    const article = await agent.post('/articles').send({
      title: 'Article',
      content: 'This article will be updated.',
    });

    const response = await agent.patch(`/articles/${article.body.id}`).send({
      title: 'Updated Title',
      content: 'Updated content.',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('title', 'Updated Title');
    expect(response.body).toHaveProperty('content', 'Updated content.');
  });
  // 인증된 상태에서 게시글 삭제 테스트
  test('DELETE /articles/:id - 인증된 상태에서 게시글 삭제', async () => {
    // 먼저 게시글 생성
    const article = await agent.post('/articles').send({
      title: 'Article to be deleted',
      content: 'This article will be deleted.',
    });
    const response = await agent.delete(`/articles/${article.body.id}`);
    expect(response.status).toBe(204);
  });
  // 인증되지 않은 상태에서 게시글 생성 테스트
  test('POST /articles - 인증되지 않은 상태에서 게시글 생성 시도', async () => {
    const response = await request(app).post('/articles').send({
      title: 'New Article',
      content: 'This is a new article.',
    });
    expect(response.status).toBe(401);
  });
  // 인증되지 않은 상태에서 게시글 수정 테스트
  test('PATCH /articles/:id - 인증되지 않은 상태에서 게시글 수정 시도', async () => {
    // 먼저 게시글 생성
    const article = await agent.post('/articles').send({
      title: 'Article',
      content: 'This article will be updated.',
    });
    const response = await request(app).patch(`/articles/${article.body.id}`).send({
      title: 'Updated Title',
      content: 'Updated content.',
    });
    expect(response.status).toBe(401);
  });
  // 인증되지 않은 상태에서 게시글 삭제 테스트
  test('DELETE /articles/:id - 인증되지 않은 상태에서 게시글 삭제 시도', async () => {
    // 먼저 게시글 생성
    const article = await agent.post('/articles').send({
      title: 'Article to be deleted',
      content: 'This article will be deleted.',
    });
    const response = await request(app).delete(`/articles/${article.body.id}`);
    expect(response.status).toBe(401);
  });
  // 다른 사용자의 게시글 수정 시도 테스트
  test('PATCH /articles/:id - 다른 사용자의 게시글 수정 시도', async () => {
    // 다른 유저 생성
    const otherUser = await prisma.user.create({
      data: {
        nickname: 'user2',
        email: 'user2@example.com',
        password: await bcrypt.hash('password123', 10),
      },
    });
    // 다른 유저로 게시글 생성
    const agent2 = request.agent(app);
    await agent2.post('/auth/login').send({
      nickname: 'user2',
      password: 'password123',
    });
    const article = await agent2.post('/articles').send({
      title: 'Other User Article',
      content: 'This article belongs to other user.',
    });

    // 원래 유저가 다른 사용자의 게시글 수정 시도
    const response = await agent.patch(`/articles/${article.body.id}`).send({
      title: 'Hacked Title',
      content: 'Hacked content.',
    });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('본인만 접근할 수 있습니다.');
  });
  // 다른 사용자의 게시글 삭제 시도 테스트
  test('DELETE /articles/:id - 다른 사용자의 게시글 삭제 시도', async () => {
    // 다른 유저 생성
    const user3 = await prisma.user.create({
      data: {
        nickname: 'user3',
        email: 'user3@example.com',
        password: await bcrypt.hash('password123', 10),
      },
    });
    // 다른 유저로 게시글 생성
    const agent3 = request.agent(app);
    await agent3.post('/auth/login').send({
      nickname: 'user3',
      password: 'password123',
    });
    const article = await agent3.post('/articles').send({
      title: 'Other User Article',
      content: 'This article belongs to other user.',
    });

    // 원래 유저가 다른 사용자의 게시글 삭제 시도
    const response = await agent.delete(`/articles/${article.body.id}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('본인만 접근할 수 있습니다.');
  });
  // 존재하지 않는 게시글 수정 시도 테스트
  test('PATCH /articles/:id - 존재하지 않는 게시글 수정 시도', async () => {
    const response = await agent.patch('/articles/9999').send({
      title: 'Non-existent Title',
      content: 'Non-existent content.',
    });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('게시글이 존재하지 않습니다.');
  });
  // 존재하지 않는 게시글 삭제 시도 테스트
  test('DELETE /articles/:id - 존재하지 않는 게시글 삭제 시도', async () => {
    const response = await agent.delete('/articles/9999');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('게시글이 존재하지 않습니다.');
  });
});
