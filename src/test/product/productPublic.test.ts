import request from 'supertest';
import app from '../../app';
import prisma from '../../lib/prisma';

describe('상품 API 인증 불필요', () => {
  test('GET /products - 상품이 없을 때 빈 배열 조회', async () => {
    const response = await request(app).get('/products');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('GET /products - 상품 목록 조회', async () => {
    // 유저 1개 생성
    const user = await prisma.user.create({
      data: {
        nickname: 'user1',
        password: 'password',
        email: 'user@example.com',
      },
    });
    // 먼저 몇 개의 상품을 생성
    await prisma.product.createMany({
      data: [
        {
          name: 'Product 1',
          description: 'Description for product 1',
          price: 100,
          tags: 'tag1,tag2',
          category: 'ELECTRONICS',
          stock: 10,
          userId: user.id,
        },
        {
          name: 'Product 2',
          description: 'Description for product 2',
          price: 200,
          tags: 'tag3,tag4',
          category: 'FASHION',
          stock: 20,
          userId: user.id,
        },
      ],
    });
    const response = await request(app).get('/products');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty('name', 'Product 1');
    expect(response.body[1]).toHaveProperty('name', 'Product 2');
  });

  test('GET /products - 파라미터에 따라 필터링', async () => {
    // 유저 1개 생성
    const user = await prisma.user.create({
      data: {
        nickname: 'user1',
        password: 'password',
        email: 'user@example.com',
      },
    });
    // 먼저 몇 개의 상품을 생성
    await prisma.product.createMany({
      data: [
        {
          name: 'Product 1',
          description: 'Description for product 1',
          price: 100,
          tags: 'tag1,tag2',
          category: 'ELECTRONICS',
          stock: 10,
          userId: user.id,
        },
        {
          name: 'Product 2',
          description: 'Description for product 2',
          price: 200,
          tags: 'tag3,tag4',
          category: 'FASHION',
          stock: 20,
          userId: user.id,
        },
      ],
    });
    const response = await request(app).get('/products?search=Product 1');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty('name', 'Product 1');
  });

  test('GET /products - oldest 정렬', async () => {
    // 유저 1개 생성
    const user = await prisma.user.create({
      data: {
        nickname: 'user1',
        password: 'password',
        email: 'user@example.com',
      },
    });
    // 먼저 몇 개의 상품을 생성
    const product1 = await prisma.product.create({
      data: {
        name: 'Product 1',
        description: 'Description for product 1',
        price: 100,
        tags: 'tag1,tag2',
        category: 'ELECTRONICS',
        stock: 10,
        userId: user.id,
      },
    });
    // 잠시 대기
    await new Promise((resolve) => setTimeout(resolve, 100));

    const product2 = await prisma.product.create({
      data: {
        name: 'Product 2',
        description: 'Description for product 2',
        price: 200,
        tags: 'tag3,tag4',
        category: 'FASHION',
        stock: 20,
        userId: user.id,
      },
    });

    const response = await request(app).get('/products?order=oldest');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].id).toBe(product1.id);
    expect(response.body[1].id).toBe(product2.id);
  });

  test('GET /products/:id - 특정 상품 조회', async () => {
    // 유저 1개 생성
    const user = await prisma.user.create({
      data: {
        nickname: 'user1',
        password: 'password',
        email: 'user@example.com',
      },
    });
    const product = await prisma.product.create({
      data: {
        name: 'Test Product',
        description: 'This is a test product.',
        price: 100,
        tags: 'test',
        category: 'FASHION',
        stock: 10,
        userId: user.id,
      },
    });
    const response = await request(app).get(`/products/${product.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', product.id);
  });
});
