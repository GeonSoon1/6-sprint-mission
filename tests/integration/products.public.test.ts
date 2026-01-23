import request from 'supertest';
import { app } from '../../src/app.js';
import * as productsService from '../../src/services/productsService.js';
import * as commentsService from '../../src/services/commentsService.js';

describe('Products public API', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('GET /products returns list', async () => {
    jest.spyOn(productsService, 'getProductList').mockResolvedValue({ list: [], totalCount: 0 });

    const res = await request(app).get('/products');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ list: [], totalCount: 0 });
  });

  it('GET /products/:id returns a product', async () => {
    jest.spyOn(productsService, 'getProduct').mockResolvedValue({
      id: 1,
      name: 'Test',
      description: 'Desc',
      price: 100,
      tags: [],
      images: [],
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      favoriteCount: 0,
      isFavorited: false,
    });

    const res = await request(app).get('/products/1');

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });

  it('GET /products/:id/comments returns comment list', async () => {
    jest
      .spyOn(commentsService, 'getCommentListByProductId')
      .mockResolvedValue({ list: [], nextCursor: null });

    const res = await request(app).get('/products/1/comments');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ list: [], nextCursor: null });
  });
});
