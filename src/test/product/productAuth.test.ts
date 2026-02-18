import request from 'supertest';
import app from '../../app';
import prisma from '../../lib/prisma';
import bcrypt from 'bcrypt';

describe('상품 API 인증 필요', () => {
  const loginAndGetAgent = async () => {
    const agent = request.agent(app);

    const hashedPassword = await bcrypt.hash('password123', 10);

    await prisma.user.create({
      data: {
        nickname: 'testuser2',
        email: `test_${Date.now()}@example.com`,
        password: hashedPassword,
      },
    });

    const loginRes = await agent.post('/auth/login').send({
      nickname: 'testuser2',
      password: 'password123',
    });

    expect(loginRes.status).toBe(200); // 🔥 중요

    return agent;
  };

  // 인증된 상태에서 상품 생성 테스트
  test('POST /products - 인증된 상태에서 상품 생성', async () => {
    const agent = await loginAndGetAgent();
    const response = await agent.post('/products').send({
      name: 'New Product',
      description: 'This is a new product.',
      price: 150,
      tags: 'new,product',
      category: 'ELECTRONICS',
      stock: 30,
    });
    expect(response.status).toBe(201);
    expect(response.body.userId).toBeDefined();
    expect(response.body).toHaveProperty('name', 'New Product');
    expect(response.body).toHaveProperty('description', 'This is a new product.');
  });
  // 인증된 상태에서 상품 수정 테스트
  test('PATCH /products/:id - 인증된 상태에서 상품 수정', async () => {
    const agent = await loginAndGetAgent();
    // 먼저 상품 생성
    const product = await agent.post('/products').send({
      name: 'Product',
      description: 'This product will be updated.',
      price: 200,
      tags: 'update,product',
      category: 'FASHION',
      stock: 50,
    });
    const response = await agent.patch(`/products/${product.body.id}`).send({
      name: 'Updated Product',
      description: 'Updated description.',
      price: 250,
      tags: 'updated,product',
      category: 'FASHION',
      stock: 40,
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Updated Product');
    expect(response.body).toHaveProperty('description', 'Updated description.');
  });
  // 인증된 상태에서 상품 삭제 테스트
  test('DELETE /products/:id - 인증된 상태에서 상품 삭제', async () => {
    const agent = await loginAndGetAgent();
    // 먼저 상품 생성
    const product = await agent.post('/products').send({
      name: 'Product to be deleted',
      description: 'This product will be deleted.',
      price: 300,
      tags: 'delete,product',
      category: 'FASHION',
      stock: 20,
    });
    const response = await agent.delete(`/products/${product.body.id}`);
    expect(response.status).toBe(204);
  });
  // 인증되지 않은 상태에서 상품 생성 테스트
  test('POST /products - 인증되지 않은 상태에서 상품 생성 시도', async () => {
    const response = await request(app).post('/products').send({
      name: 'New Product',
      description: 'This is a new product.',
      price: 150,
      tags: 'new,product',
      category: 'ELECTRONICS',
      stock: 30,
    });
    expect(response.status).toBe(401);
  });
  // 인증되지 않은 상태에서 상품 수정 테스트
  test('PATCH /products/:id - 인증되지 않은 상태에서 상품 수정 시도', async () => {
    // 먼저 상품 생성
    const agent = await loginAndGetAgent();
    const product = await agent.post('/products').send({
      name: 'Product',
      description: 'This product will be updated.',
      price: 200,
      tags: 'update,product',
      category: 'FASHION',
      stock: 50,
    });
    const response = await request(app).patch(`/products/${product.body.id}`).send({
      name: 'Updated Product',
      description: 'Updated description.',
      price: 250,
      tags: 'updated,product',
      category: 'FASHION',
      stock: 40,
    });
    expect(response.status).toBe(401);
  });
  // 인증되지 않은 상태에서 상품 삭제 테스트
  test('DELETE /products/:id - 인증되지 않은 상태에서 상품 삭제 시도', async () => {
    const agent = await loginAndGetAgent();
    // 먼저 상품 생성
    const product = await agent.post('/products').send({
      name: 'Product to be deleted',
      description: 'This product will be deleted.',
      price: 300,
      tags: 'delete,product',
      category: 'FASHION',
      stock: 20,
    });
    const response = await request(app).delete(`/products/${product.body.id}`);
    expect(response.status).toBe(401);
  });
  // 다른 사용자의 상품 수정 시도 테스트
  test('PATCH /products/:id - 다른 사용자의 상품 수정 시도', async () => {
    const agent = await loginAndGetAgent();
    // 다른 사용자 생성
    const user2 = await prisma.user.create({
      data: {
        nickname: 'user2',
        email: 'user2@example.com',
        password: await bcrypt.hash('password456', 10),
      },
    });
    // 다른 사용자가 상품 생성
    const agent2 = request.agent(app);
    await agent2.post('/auth/login').send({
      nickname: 'user2',
      password: 'password456',
    });
    const product = await agent2.post('/products').send({
      name: 'User2 Product',
      description: 'User2 product description.',
      price: 400,
      tags: 'other,user,product',
      category: 'ELECTRONICS',
      stock: 15,
    });
    // 원래 사용자로 다른 사용자의 상품 수정 시도
    const response = await agent.patch(`/products/${product.body.id}`).send({
      name: 'Hacked Product',
      description: 'User2 product hacked description.',
      price: 500,
      tags: 'hacked,product',
      category: 'ELECTRONICS',
      stock: 10,
    });
    expect(response.status).toBe(403);
    expect(response.body.message).toBe('본인만 접근할 수 있습니다.');
  });
  // 다른 사용자의 상품 삭제 시도 테스트
  test('DELETE /products/:id - 다른 사용자의 상품 삭제 시도', async () => {
    const agent = await loginAndGetAgent();
    // 다른 사용자 생성
    const user3 = await prisma.user.create({
      data: {
        nickname: 'user3',
        email: 'user3@example.com',
        password: await bcrypt.hash('password456', 10),
      },
    });
    // 다른 사용자가 상품 생성
    const agent2 = request.agent(app);
    await agent2.post('/auth/login').send({
      nickname: 'user3',
      password: 'password456',
    });
    const product = await agent2.post('/products').send({
      name: 'User3 Product',
      description: 'User3 product description.',
      price: 400,
      tags: 'other,user,product',
      category: 'ELECTRONICS',
      stock: 15,
    });
    // 원래 사용자로 다른 사용자의 상품 삭제 시도
    const response = await agent.delete(`/products/${product.body.id}`);
    expect(response.status).toBe(403);
    expect(response.body.message).toBe('본인만 접근할 수 있습니다.');
  });
  // 존재하지 않는 상품 수정 시도 테스트
  test('PATCH /products/:id - 존재하지 않는 상품 수정 시도', async () => {
    const agent = await loginAndGetAgent();
    const response = await agent.patch('/products/9999').send({
      name: 'Non-existent Product',
      description: 'This product does not exist.',
      price: 500,
      tags: 'non-existent,product',
      category: 'ELECTRONICS',
      stock: 10,
    });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('해당 상품이 없습니다.');
  });
  // 존재하지 않는 상품 삭제 시도 테스트
  test('DELETE /products/:id - 존재하지 않는 상품 삭제 시도', async () => {
    const agent = await loginAndGetAgent();
    const response = await agent.delete('/products/9999');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('해당 상품이 없습니다.');
  });
  // 가격이 음수
  test('POST /products - 가격이 음수인 상품 생성 시도', async () => {
    const agent = await loginAndGetAgent();
    const response = await agent.post('/products').send({
      name: 'Invalid Product',
      description: 'This product has a negative price.',
      price: -100,
      tags: 'invalid,product',
      category: 'ELECTRONICS',
      stock: 10,
    });
    expect(response.status).toBe(400);
  });
  // 필드 일부만 수정
  test('PATCH /products/:id - 필드 일부만 수정', async () => {
    const agent = await loginAndGetAgent();
    // 먼저 상품 생성
    const product = await agent.post('/products').send({
      name: 'Partial Update Product',
      description: 'This product will be partially updated.',
      price: 200,
      tags: 'partial,update,product',
      category: 'FASHION',
      stock: 50,
    });
    const response = await agent.patch(`/products/${product.body.id}`).send({
      price: 250,
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Partial Update Product');
    expect(response.body).toHaveProperty('price', 250);
  });
  // 좋아요 한 상품 가격 변경 시 알림 메시지 확인
  test('PATCH /products/:id - 가격 변경 시 알림 메시지 확인', async () => {
    const agent = await loginAndGetAgent();
    // 좋아요 할 상품을 생성할 유저 생성
    const user2 = await prisma.user.create({
      data: {
        nickname: 'user4',
        email: 'user4@example.com',
        password: await bcrypt.hash('password456', 10),
      },
    });
    // 테스트 유저가 상품 생성
    const agent4 = request.agent(app);
    await agent4.post('/auth/login').send({
      nickname: 'user4',
      password: 'password456',
    });
    const product = await agent4.post('/products').send({
      name: 'Liked Product',
      description: 'This product will be liked.',
      price: 300,
      tags: 'liked,product',
      category: 'ELECTRONICS',
      stock: 25,
    });
    // 원래 유저가 상품 좋아요
    const likeResponse = await agent.post(`/products/${product.body.id}/like`).send();
    // 테스트 유저가 상품 가격 변경
    const response = await agent4.patch(`/products/${product.body.id}`).send({
      price: 350,
    });
    expect(response.status).toBe(200);
    // 좋아요 누른 유저
    const liker = await prisma.user.findUnique({
      where: { nickname: 'testuser2' },
    });
    // 가격 변경 확인
    expect(response.body).toHaveProperty('price', 350);
    // 알림 메시지 확인
    const notifications = await prisma.notification.findMany({
      where: { userId: liker!.id },
    });
    console.log(liker);
    expect(notifications.length).toBe(1);
    expect(notifications[0].userId).toBe(liker!.id);
    expect(notifications[0].type).toBe('PRICE_CHANGED');
  });
});
