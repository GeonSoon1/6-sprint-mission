import request from 'supertest';
import { app } from '../../src/app.js';
import * as productsService from '../../src/services/productsService.js';
import * as token from '../../src/lib/token.js';
import { prismaClient } from '../../src/lib/prismaClient.js';

describe('Products auth-required API', () => {
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

  it('POST /products returns 401 without auth', async () => {
    const res = await request(app).post('/products').send({
      name: 'Test',
      description: 'Desc',
      price: 10,
      tags: [],
      images: [],
    });

    expect(res.status).toBe(401);
  });

  it('POST /products creates a product with auth', async () => {
    const createSpy = jest
      .spyOn(productsService, 'createProduct')
      .mockResolvedValue({ id: 1 } as never);

    const res = await request(app)
      .post('/products')
      .set('Cookie', ['access-token=test'])
      .send({
        name: 'Test',
        description: 'Desc',
        price: 10,
        tags: [],
        images: [],
      });

    expect(res.status).toBe(201);
    expect(createSpy).toHaveBeenCalled();
  });

  it('PATCH /products/:id updates a product with auth', async () => {
    jest.spyOn(productsService, 'updateProduct').mockResolvedValue({ id: 1 } as never);

    const res = await request(app)
      .patch('/products/1')
      .set('Cookie', ['access-token=test'])
      .send({ price: 15 });

    expect(res.status).toBe(200);
  });

  it('DELETE /products/:id deletes a product with auth', async () => {
    jest.spyOn(productsService, 'deleteProduct').mockResolvedValue(undefined);

    const res = await request(app)
      .delete('/products/1')
      .set('Cookie', ['access-token=test']);

    expect(res.status).toBe(204);
  });
});
