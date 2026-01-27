import request from 'supertest';
import { app } from '../../src/app.js';
import * as articlesService from '../../src/services/articlesService.js';
import * as commentsService from '../../src/services/commentsService.js';
import * as likesService from '../../src/services/likesService.js';
import * as token from '../../src/lib/token.js';
import { prismaClient } from '../../src/lib/prismaClient.js';

describe('Articles auth-required API', () => {
  beforeEach(() => {
    jest.spyOn(token, 'verifyAccessToken').mockReturnValue({ userId: 1 });
    jest.spyOn(prismaClient.user, 'findUnique').mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      nickname: 'user',
      image: null,
      password: 'hashed',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('POST /articles returns 401 without auth', async () => {
    const res = await request(app).post('/articles').send({
      title: 'Title',
      content: 'Content',
      image: null,
    });

    expect(res.status).toBe(401);
  });

  it('POST /articles creates article with auth', async () => {
    jest.spyOn(articlesService, 'createArticle').mockResolvedValue({ id: 1 } as never);

    const res = await request(app)
      .post('/articles')
      .set('Cookie', ['access-token=test'])
      .send({
        title: 'Title',
        content: 'Content',
        image: null,
      });

    expect(res.status).toBe(201);
  });

  it('PATCH /articles/:id updates article with auth', async () => {
    jest.spyOn(articlesService, 'updateArticle').mockResolvedValue({ id: 1 } as never);

    const res = await request(app)
      .patch('/articles/1')
      .set('Cookie', ['access-token=test'])
      .send({ title: 'Updated' });

    expect(res.status).toBe(200);
  });

  it('DELETE /articles/:id deletes article with auth', async () => {
    jest.spyOn(articlesService, 'deleteArticle').mockResolvedValue(undefined);

    const res = await request(app)
      .delete('/articles/1')
      .set('Cookie', ['access-token=test']);

    expect(res.status).toBe(204);
  });

  it('POST /articles/:id/comments creates comment with auth', async () => {
    jest.spyOn(commentsService, 'createComment').mockResolvedValue({ id: 1 } as never);

    const res = await request(app)
      .post('/articles/1/comments')
      .set('Cookie', ['access-token=test'])
      .send({ content: 'Nice post' });

    expect(res.status).toBe(201);
  });

  it('POST /articles/:id/likes creates like with auth', async () => {
    jest.spyOn(likesService, 'createLike').mockResolvedValue(undefined);

    const res = await request(app)
      .post('/articles/1/likes')
      .set('Cookie', ['access-token=test']);

    expect(res.status).toBe(201);
  });

  it('DELETE /articles/:id/likes deletes like with auth', async () => {
    jest.spyOn(likesService, 'deleteLike').mockResolvedValue(undefined);

    const res = await request(app)
      .delete('/articles/1/likes')
      .set('Cookie', ['access-token=test']);

    expect(res.status).toBe(204);
  });
});
