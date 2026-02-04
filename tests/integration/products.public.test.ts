import request from 'supertest';
import { app } from '../../src/app.js';
import * as productsService from '../../src/services/productsService.js';
import * as commentsService from '../../src/services/commentsService.js';
import NotFoundError from '../../src/lib/errors/NotFoundError.js';

describe('Products public API - 통합 테스트', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /products', () => {
    it('상품 목록을 반환한다', async () => {
      const mockProductList = {
        list: [
          {
            id: 1,
            name: 'Test Product',
            description: 'Test Description',
            price: 100,
            tags: [],
            images: [],
            userId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            favoriteCount: 0,
            isFavorited: false,
          },
        ],
        totalCount: 1,
      };

      jest.spyOn(productsService, 'getProductList').mockResolvedValue(mockProductList);

      const res = await request(app).get('/products');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        list: expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            name: 'Test Product',
            price: 100,
          }),
        ]),
        totalCount: 1,
      });
      expect(productsService.getProductList).toHaveBeenCalled();
    });

    it('쿼리 파라미터와 함께 상품 목록을 조회할 수 있다', async () => {
      jest.spyOn(productsService, 'getProductList').mockResolvedValue({ list: [], totalCount: 0 });

      const res = await request(app).get('/products?page=1&pageSize=10');

      expect(res.status).toBe(200);
      expect(productsService.getProductList).toHaveBeenCalled();
    });
  });

  describe('GET /products/:id', () => {
    it('상품 상세 정보를 반환한다', async () => {
      const mockProduct = {
        id: 1,
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        tags: ['tag1', 'tag2'],
        images: ['image1.jpg'],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        favoriteCount: 5,
        isFavorited: false,
      };

      jest.spyOn(productsService, 'getProduct').mockResolvedValue(mockProduct);

      const res = await request(app).get('/products/1');

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: 1,
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
      });
      expect(productsService.getProduct).toHaveBeenCalledWith(1);
    });

    it('존재하지 않는 상품 ID로 요청 시 404를 반환한다', async () => {
      jest.spyOn(productsService, 'getProduct').mockRejectedValue(new NotFoundError('product', 999));

      const res = await request(app).get('/products/999');

      expect(res.status).toBe(404);
    });
  });

  describe('GET /products/:id/comments', () => {
    it('상품 댓글 목록을 반환한다', async () => {
      const mockComments = {
        list: [
          {
            id: 1,
            content: 'Great product!',
            userId: 1,
            productId: 1,
            articleId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        nextCursor: null,
      };

      jest.spyOn(commentsService, 'getCommentListByProductId').mockResolvedValue(mockComments);

      const res = await request(app).get('/products/1/comments');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('list');
      expect(res.body).toHaveProperty('nextCursor');
      expect(commentsService.getCommentListByProductId).toHaveBeenCalled();
    });

    it('커서 파라미터와 함께 댓글 목록을 조회할 수 있다', async () => {
      jest
        .spyOn(commentsService, 'getCommentListByProductId')
        .mockResolvedValue({ list: [], nextCursor: null });

      const res = await request(app).get('/products/1/comments?cursor=123&limit=10');

      expect(res.status).toBe(200);
      expect(commentsService.getCommentListByProductId).toHaveBeenCalled();
    });
  });
});
