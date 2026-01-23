import request from 'supertest';
import { app } from '../../src/app.js';
import * as articlesService from '../../src/services/articlesService.js';
import * as commentsService from '../../src/services/commentsService.js';

describe('Articles public API', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('GET /articles returns list', async () => {
    jest.spyOn(articlesService, 'getArticleList').mockResolvedValue({ list: [], totalCount: 0 });

    const res = await request(app).get('/articles');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ list: [], totalCount: 0 });
  });

  it('GET /articles/:id returns an article', async () => {
    jest.spyOn(articlesService, 'getArticle').mockResolvedValue({
      id: 1,
      title: 'Title',
      content: 'Content',
      image: null,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      likeCount: 0,
      isLiked: false,
    });

    const res = await request(app).get('/articles/1');

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });

  it('GET /articles/:id/comments returns comment list', async () => {
    jest
      .spyOn(commentsService, 'getCommentListByArticleId')
      .mockResolvedValue({ list: [], nextCursor: null });

    const res = await request(app).get('/articles/1/comments');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ list: [], nextCursor: null });
  });
});
