import request from 'supertest';
import { app } from '../../src/app.js';
import * as articlesService from '../../src/services/articlesService.js';
import * as commentsService from '../../src/services/commentsService.js';
import * as likesService from '../../src/services/likesService.js';
import * as token from '../../src/lib/token.js';
import { prismaClient } from '../../src/lib/prismaClient.js';
import { ACCESS_TOKEN_COOKIE_NAME } from '../../src/lib/constants.js';
import NotFoundError from '../../src/lib/errors/NotFoundError.js';
import ForbiddenError from '../../src/lib/errors/ForbiddenError.js';

describe('Articles auth-required API - 통합 테스트', () => {
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

  describe('POST /articles', () => {
    it('인증 없이 요청 시 401을 반환한다', async () => {
      const res = await request(app).post('/articles').send({
        title: 'Title',
        content: 'Content',
        image: null,
      });

      expect(res.status).toBe(401);
    });

    it('인증된 사용자가 게시글을 생성할 수 있다', async () => {
      const mockArticle = {
        id: 1,
        title: 'Test Article',
        content: 'Test Content',
        image: 'image.jpg',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        likeCount: 0,
        isLiked: false,
      };

      jest.spyOn(articlesService, 'createArticle').mockResolvedValue(mockArticle);

      const res = await request(app)
        .post('/articles')
        .set('Cookie', [`${ACCESS_TOKEN_COOKIE_NAME}=test-token`])
        .send({
          title: 'Test Article',
          content: 'Test Content',
          image: 'image.jpg',
        });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        id: 1,
        title: 'Test Article',
        content: 'Test Content',
      });
      expect(articlesService.createArticle).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Article',
          userId: 1,
        }),
      );
    });
  });

  describe('PATCH /articles/:id', () => {
    it('인증 없이 요청 시 401을 반환한다', async () => {
      const res = await request(app).patch('/articles/1').send({ title: 'Updated' });

      expect(res.status).toBe(401);
    });

    it('인증된 사용자가 자신의 게시글을 수정할 수 있다', async () => {
      const mockUpdatedArticle = {
        id: 1,
        title: 'Updated Article',
        content: 'Updated Content',
        image: null,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        likeCount: 0,
        isLiked: false,
      };

      jest.spyOn(articlesService, 'updateArticle').mockResolvedValue(mockUpdatedArticle);

      const res = await request(app)
        .patch('/articles/1')
        .set('Cookie', [`${ACCESS_TOKEN_COOKIE_NAME}=test-token`])
        .send({ title: 'Updated Article' });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: 1,
        title: 'Updated Article',
      });
      expect(articlesService.updateArticle).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          userId: 1,
          title: 'Updated Article',
        }),
      );
    });

    it('존재하지 않는 게시글 수정 시 404를 반환한다', async () => {
      jest
        .spyOn(articlesService, 'updateArticle')
        .mockRejectedValue(new NotFoundError('article', 999));

      const res = await request(app)
        .patch('/articles/999')
        .set('Cookie', [`${ACCESS_TOKEN_COOKIE_NAME}=test-token`])
        .send({ title: 'Updated' });

      expect(res.status).toBe(404);
    });

    it('다른 사용자의 게시글 수정 시 403을 반환한다', async () => {
      jest
        .spyOn(articlesService, 'updateArticle')
        .mockRejectedValue(new ForbiddenError('Should be the owner of the article'));

      const res = await request(app)
        .patch('/articles/1')
        .set('Cookie', [`${ACCESS_TOKEN_COOKIE_NAME}=test-token`])
        .send({ title: 'Updated' });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /articles/:id', () => {
    it('인증 없이 요청 시 401을 반환한다', async () => {
      const res = await request(app).delete('/articles/1');

      expect(res.status).toBe(401);
    });

    it('인증된 사용자가 자신의 게시글을 삭제할 수 있다', async () => {
      jest.spyOn(articlesService, 'deleteArticle').mockResolvedValue(undefined);

      const res = await request(app)
        .delete('/articles/1')
        .set('Cookie', [`${ACCESS_TOKEN_COOKIE_NAME}=test-token`]);

      expect(res.status).toBe(204);
      expect(articlesService.deleteArticle).toHaveBeenCalledWith(1, 1);
    });

    it('존재하지 않는 게시글 삭제 시 404를 반환한다', async () => {
      jest
        .spyOn(articlesService, 'deleteArticle')
        .mockRejectedValue(new NotFoundError('article', 999));

      const res = await request(app)
        .delete('/articles/999')
        .set('Cookie', [`${ACCESS_TOKEN_COOKIE_NAME}=test-token`]);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /articles/:id/comments', () => {
    it('인증 없이 요청 시 401을 반환한다', async () => {
      const res = await request(app).post('/articles/1/comments').send({ content: 'Nice post!' });

      expect(res.status).toBe(401);
    });

    it('인증된 사용자가 게시글에 댓글을 작성할 수 있다', async () => {
      const mockComment = {
        id: 1,
        content: 'Great article!',
        userId: 1,
        productId: null,
        articleId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(commentsService, 'createComment').mockResolvedValue(mockComment);

      const res = await request(app)
        .post('/articles/1/comments')
        .set('Cookie', [`${ACCESS_TOKEN_COOKIE_NAME}=test-token`])
        .send({ content: 'Great article!' });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        content: 'Great article!',
      });
      expect(commentsService.createComment).toHaveBeenCalled();
    });
  });

  describe('POST /articles/:id/likes', () => {
    it('인증 없이 요청 시 401을 반환한다', async () => {
      const res = await request(app).post('/articles/1/likes');

      expect(res.status).toBe(401);
    });

    it('인증된 사용자가 게시글에 좋아요를 추가할 수 있다', async () => {
      jest.spyOn(likesService, 'createLike').mockResolvedValue(undefined);

      const res = await request(app)
        .post('/articles/1/likes')
        .set('Cookie', [`${ACCESS_TOKEN_COOKIE_NAME}=test-token`]);

      expect(res.status).toBe(201);
      expect(likesService.createLike).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('DELETE /articles/:id/likes', () => {
    it('인증 없이 요청 시 401을 반환한다', async () => {
      const res = await request(app).delete('/articles/1/likes');

      expect(res.status).toBe(401);
    });

    it('인증된 사용자가 좋아요를 제거할 수 있다', async () => {
      jest.spyOn(likesService, 'deleteLike').mockResolvedValue(undefined);

      const res = await request(app)
        .delete('/articles/1/likes')
        .set('Cookie', [`${ACCESS_TOKEN_COOKIE_NAME}=test-token`]);

      expect(res.status).toBe(204);
      expect(likesService.deleteLike).toHaveBeenCalledWith(1, 1);
    });
  });
});
