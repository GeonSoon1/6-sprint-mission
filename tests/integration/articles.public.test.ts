import request from 'supertest';
import { app } from '../../src/app.js';
import * as articlesService from '../../src/services/articlesService.js';
import * as commentsService from '../../src/services/commentsService.js';
import NotFoundError from '../../src/lib/errors/NotFoundError.js';

describe('Articles public API - 통합 테스트', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /articles', () => {
    it('게시글 목록을 반환한다', async () => {
      const mockArticleList = {
        list: [
          {
            id: 1,
            title: 'Test Article',
            content: 'Test Content',
            image: null,
            userId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            likeCount: 0,
            isLiked: false,
          },
        ],
        totalCount: 1,
      };

      jest.spyOn(articlesService, 'getArticleList').mockResolvedValue(mockArticleList);

      const res = await request(app).get('/articles');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        list: expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            title: 'Test Article',
          }),
        ]),
        totalCount: 1,
      });
      expect(articlesService.getArticleList).toHaveBeenCalled();
    });

    it('쿼리 파라미터와 함께 게시글 목록을 조회할 수 있다', async () => {
      jest.spyOn(articlesService, 'getArticleList').mockResolvedValue({ list: [], totalCount: 0 });

      const res = await request(app).get('/articles?page=1&pageSize=10');

      expect(res.status).toBe(200);
      expect(articlesService.getArticleList).toHaveBeenCalled();
    });
  });

  describe('GET /articles/:id', () => {
    it('게시글 상세 정보를 반환한다', async () => {
      const mockArticle = {
        id: 1,
        title: 'Test Article',
        content: 'Test Content',
        image: 'image.jpg',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        likeCount: 10,
        isLiked: false,
      };

      jest.spyOn(articlesService, 'getArticle').mockResolvedValue(mockArticle);

      const res = await request(app).get('/articles/1');

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: 1,
        title: 'Test Article',
        content: 'Test Content',
        likeCount: 10,
      });
      expect(articlesService.getArticle).toHaveBeenCalledWith(1);
    });

    it('존재하지 않는 게시글 ID로 요청 시 404를 반환한다', async () => {
      jest.spyOn(articlesService, 'getArticle').mockRejectedValue(new NotFoundError('article', 999));

      const res = await request(app).get('/articles/999');

      expect(res.status).toBe(404);
    });
  });

  describe('GET /articles/:id/comments', () => {
    it('게시글 댓글 목록을 반환한다', async () => {
      const mockComments = {
        list: [
          {
            id: 1,
            content: 'Great article!',
            userId: 1,
            productId: null,
            articleId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        nextCursor: null,
      };

      jest.spyOn(commentsService, 'getCommentListByArticleId').mockResolvedValue(mockComments);

      const res = await request(app).get('/articles/1/comments');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('list');
      expect(res.body).toHaveProperty('nextCursor');
      expect(commentsService.getCommentListByArticleId).toHaveBeenCalled();
    });

    it('커서 파라미터와 함께 댓글 목록을 조회할 수 있다', async () => {
      jest
        .spyOn(commentsService, 'getCommentListByArticleId')
        .mockResolvedValue({ list: [], nextCursor: null });

      const res = await request(app).get('/articles/1/comments?cursor=123&limit=10');

      expect(res.status).toBe(200);
      expect(commentsService.getCommentListByArticleId).toHaveBeenCalled();
    });
  });
});
