import request from 'supertest';
import { app } from '../../src/app.js';
import * as productsService from '../../src/services/productsService.js';
import * as commentsService from '../../src/services/commentsService.js';
import * as favoritesService from '../../src/services/favoritesService.js';
import * as token from '../../src/lib/token.js';
import { prismaClient } from '../../src/lib/prismaClient.js';
import { ACCESS_TOKEN_COOKIE_NAME } from '../../src/lib/constants.js';
import NotFoundError from '../../src/lib/errors/NotFoundError.js';
import ForbiddenError from '../../src/lib/errors/ForbiddenError.js';

describe('Products auth-required API - 통합 테스트', () => {
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

  describe('POST /products', () => {
    it('인증 없이 요청 시 401을 반환한다', async () => {
      const res = await request(app).post('/products').send({
        name: 'Test',
        description: 'Desc',
        price: 10,
        tags: [],
        images: [],
      });

      expect(res.status).toBe(401);
    });

    it('인증된 사용자가 상품을 생성할 수 있다', async () => {
      const mockProduct = {
        id: 1,
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        tags: ['tag1'],
        images: ['image1.jpg'],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        favoriteCount: 0,
        isFavorited: false,
      };

      const createSpy = jest
        .spyOn(productsService, 'createProduct')
        .mockResolvedValue(mockProduct);

      const res = await request(app)
        .post('/products')
        .set('Cookie', [`${ACCESS_TOKEN_COOKIE_NAME}=test-token`])
        .send({
          name: 'Test Product',
          description: 'Test Description',
          price: 100,
          tags: ['tag1'],
          images: ['image1.jpg'],
        });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        id: 1,
        name: 'Test Product',
        price: 100,
      });
      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Product',
          userId: 1,
        }),
      );
    });
  });

  describe('PATCH /products/:id', () => {
    it('인증 없이 요청 시 401을 반환한다', async () => {
      const res = await request(app).patch('/products/1').send({ price: 15 });

      expect(res.status).toBe(401);
    });

    it('인증된 사용자가 자신의 상품을 수정할 수 있다', async () => {
      const mockUpdatedProduct = {
        id: 1,
        name: 'Updated Product',
        description: 'Updated Description',
        price: 150,
        tags: [],
        images: [],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        favoriteCount: 0,
        isFavorited: false,
      };

      jest.spyOn(productsService, 'updateProduct').mockResolvedValue(mockUpdatedProduct);

      const res = await request(app)
        .patch('/products/1')
        .set('Cookie', [`${ACCESS_TOKEN_COOKIE_NAME}=test-token`])
        .send({ price: 150 });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: 1,
        price: 150,
      });
      expect(productsService.updateProduct).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          userId: 1,
          price: 150,
        }),
      );
    });

    it('존재하지 않는 상품 수정 시 404를 반환한다', async () => {
      jest
        .spyOn(productsService, 'updateProduct')
        .mockRejectedValue(new NotFoundError('product', 999));

      const res = await request(app)
        .patch('/products/999')
        .set('Cookie', [`${ACCESS_TOKEN_COOKIE_NAME}=test-token`])
        .send({ price: 150 });

      expect(res.status).toBe(404);
    });

    it('다른 사용자의 상품 수정 시 403을 반환한다', async () => {
      jest
        .spyOn(productsService, 'updateProduct')
        .mockRejectedValue(new ForbiddenError('Should be the owner of the product'));

      const res = await request(app)
        .patch('/products/1')
        .set('Cookie', [`${ACCESS_TOKEN_COOKIE_NAME}=test-token`])
        .send({ price: 150 });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /products/:id', () => {
    it('인증 없이 요청 시 401을 반환한다', async () => {
      const res = await request(app).delete('/products/1');

      expect(res.status).toBe(401);
    });

    it('인증된 사용자가 자신의 상품을 삭제할 수 있다', async () => {
      jest.spyOn(productsService, 'deleteProduct').mockResolvedValue(undefined);

      const res = await request(app)
        .delete('/products/1')
        .set('Cookie', [`${ACCESS_TOKEN_COOKIE_NAME}=test-token`]);

      expect(res.status).toBe(204);
      expect(productsService.deleteProduct).toHaveBeenCalledWith(1, 1);
    });

    it('존재하지 않는 상품 삭제 시 404를 반환한다', async () => {
      jest
        .spyOn(productsService, 'deleteProduct')
        .mockRejectedValue(new NotFoundError('product', 999));

      const res = await request(app)
        .delete('/products/999')
        .set('Cookie', [`${ACCESS_TOKEN_COOKIE_NAME}=test-token`]);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /products/:id/comments', () => {
    it('인증 없이 요청 시 401을 반환한다', async () => {
      const res = await request(app).post('/products/1/comments').send({ content: 'Nice!' });

      expect(res.status).toBe(401);
    });

    it('인증된 사용자가 상품에 댓글을 작성할 수 있다', async () => {
      const mockComment = {
        id: 1,
        content: 'Great product!',
        userId: 1,
        productId: 1,
        articleId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(commentsService, 'createComment').mockResolvedValue(mockComment);

      const res = await request(app)
        .post('/products/1/comments')
        .set('Cookie', [`${ACCESS_TOKEN_COOKIE_NAME}=test-token`])
        .send({ content: 'Great product!' });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        content: 'Great product!',
      });
      expect(commentsService.createComment).toHaveBeenCalled();
    });
  });

  describe('POST /products/:id/favorites', () => {
    it('인증 없이 요청 시 401을 반환한다', async () => {
      const res = await request(app).post('/products/1/favorites');

      expect(res.status).toBe(401);
    });

    it('인증된 사용자가 상품을 즐겨찾기에 추가할 수 있다', async () => {
      jest.spyOn(favoritesService, 'createFavorite').mockResolvedValue(undefined);

      const res = await request(app)
        .post('/products/1/favorites')
        .set('Cookie', [`${ACCESS_TOKEN_COOKIE_NAME}=test-token`]);

      expect(res.status).toBe(201);
      expect(favoritesService.createFavorite).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('DELETE /products/:id/favorites', () => {
    it('인증 없이 요청 시 401을 반환한다', async () => {
      const res = await request(app).delete('/products/1/favorites');

      expect(res.status).toBe(401);
    });

    it('인증된 사용자가 즐겨찾기에서 제거할 수 있다', async () => {
      jest.spyOn(favoritesService, 'deleteFavorite').mockResolvedValue(undefined);

      const res = await request(app)
        .delete('/products/1/favorites')
        .set('Cookie', [`${ACCESS_TOKEN_COOKIE_NAME}=test-token`]);

      expect(res.status).toBe(204);
      expect(favoritesService.deleteFavorite).toHaveBeenCalledWith(1, 1);
    });
  });
});
