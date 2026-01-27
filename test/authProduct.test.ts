import request from 'supertest';
import { prismaClient } from '@lib/prismaClient';
import app from '@/app';
import { userSample, productSample } from '@test/helper/mockdata';
import { createProductsWithUsers } from '@test/helper/product';

describe('인증이 필요한 상품 API 통합 테스트', () => {
  console.log('auth product run!!');

  beforeAll(async () => {
    await prismaClient.notification.deleteMany();
    await prismaClient.like.deleteMany();
    await prismaClient.article.deleteMany();
  });

  beforeEach(async () => {
    await prismaClient.favorite.deleteMany();
    await prismaClient.comment.deleteMany();
    await prismaClient.product.deleteMany();
    await prismaClient.user.deleteMany();

    // 사용자 식별 테스트를 위하여 임의로 user data 2개 입력
    await request(app).post('/auth/register').send({
      email: 'test@test.com',
      nickname: 'tester',
      password: 'qwer1234',
      image: 'test.jpg',
    });

    await request(app).post('/auth/register').send({
      email: 'test2@test.com',
      nickname: 'tester2',
      password: 'qwer1234',
      image: 'test.jpg',
    });
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  describe('인증을 거친 후 상품 생성 POST /products', () => {
    test('신규 상품 등록 : name, description, price, tags, images', async () => {
      const agent = request.agent(app);

      const user = await agent
        .post('/auth/login')
        .send({ email: 'test@test.com', password: 'qwer1234' });

      expect(user.status).toBe(200);

      const productResponse = await agent.post('/products').send({
        name: '로봇',
        description: '어린이용 변신 로봇',
        price: 5000,
        tags: ['어린이', '장난감'],
        images: ['img1.jpg', 'img1.png'],
        // userID의 경우 agent의 토큰으로 자동 변환 되므로 전달 불필요
      });

      expect(productResponse.status).toBe(201);
      expect(productResponse.body.name).toBe('로봇');
    });

    test('신규 상품 등록 : tags & image 빈 배열', async () => {
      const agent = request.agent(app);

      const user = await agent
        .post('/auth/login')
        .send({ email: 'test@test.com', password: 'qwer1234' });

      expect(user.status).toBe(200);

      const productResponse = await agent.post('/products').send({
        name: '로봇',
        description: '어린이용 변신 로봇',
        price: 5000,
        tags: [],
        images: [],
      });

      expect(productResponse.status).toBe(201);
      expect(productResponse.body.name).toBe('로봇');
    });

    test('신규 상품 등록 필수값 누락 : name', async () => {
      const agent = request.agent(app);

      const user = await agent
        .post('/auth/login')
        .send({ email: 'test@test.com', password: 'qwer1234' });

      expect(user.status).toBe(200);

      const productResponse = await agent.post('/products').send({
        name: '',
        description: '어린이용 변신 로봇',
        price: 5000,
        tags: ['어린이', '장난감'],
        images: ['img1.jpg', 'img1.png'],
      });

      expect(productResponse.status).toBe(400);
    });

    test('신규 상품 등록 필수값 누락 : description', async () => {
      const agent = request.agent(app);

      const user = await agent
        .post('/auth/login')
        .send({ email: 'test@test.com', password: 'qwer1234' });

      expect(user.status).toBe(200);

      const productResponse = await agent.post('/products').send({
        name: '로봇',
        description: '',
        price: 5000,
        tags: ['어린이', '장난감'],
        images: ['img1.jpg', 'img1.png'],
      });

      expect(productResponse.status).toBe(400);
    });

    test('신규 상품 등록 필수값 누락 : price', async () => {
      const agent = request.agent(app);

      const user = await agent
        .post('/auth/login')
        .send({ email: 'test@test.com', password: 'qwer1234' });

      expect(user.status).toBe(200);

      const productResponse = await agent.post('/products').send({
        name: '로봇',
        description: '어린이용 변신 로봇',
        price: '',
        tags: ['어린이', '장난감'],
        images: ['img1.jpg', 'img1.png'],
      });

      expect(productResponse.status).toBe(400);
    });
  });

  describe('인증을 거친 후 상품 목록 조회 GET /products', () => {
    test('상품이 없는 경우, 빈 배열 반환', async () => {
      const agent = request.agent(app);

      const user = await agent
        .post('/auth/login')
        .send({ email: 'test@test.com', password: 'qwer1234' });

      expect(user.status).toBe(200);

      const getResponse = await agent.get('/products');

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.list).toEqual([]);
      expect(getResponse.body.totalCount).toBe(0);
    });

    test('상품이 있는 경우, 전체 목록 조회', async () => {
      await createProductsWithUsers(userSample, productSample);

      const agent = request.agent(app);

      const user = await agent
        .post('/auth/login')
        .send({ email: 'test@test.com', password: 'qwer1234' });

      expect(user.status).toBe(200);

      const getResponse = await agent.get('/products');

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.list.length).toBe(10);
      expect(getResponse.body.totalCount).toBe(24);
    });
  });

  describe('인증을 거친 후 상품 상세 조회 GET /products/:id', () => {
    test('생성자와 관계 없이 상세 조회 가능', async () => {
      const agent = request.agent(app);
      await agent.post('/auth/login').send({ email: 'test@test.com', password: 'qwer1234' });

      const product = await agent.post('/products').send({
        name: '로봇',
        description: '어린이용 변신 로봇',
        price: 5000,
        tags: ['어린이', '장난감'],
        images: ['img1.jpg', 'img1.png'],
      });

      await agent.post('/auth/logout');
      await agent.post('/auth/login').send({ email: 'test2@test.com', password: 'qwer1234' });

      const getResponse = await agent.get(`/products/${product.body.id}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.name).toBe('로봇');
    });

    test('존재하지 않는 상품 상세 조회', async () => {
      const agent = request.agent(app);
      await agent.post('/auth/login').send({ email: 'test@test.com', password: 'qwer1234' });

      const product = await agent.post('/products').send({
        name: '로봇',
        description: '어린이용 변신 로봇',
        price: 5000,
        tags: ['어린이', '장난감'],
        images: ['img1.jpg', 'img1.png'],
      });

      const getResponse = await agent.get(`/products/${product.body.id + 1}`);

      expect(getResponse.status).toBe(404);
      expect(getResponse.body.message).toBe(`product with id ${product.body.id + 1} not found`);
    });
  });

  describe('인증을 거친 후 상품 수정 PATCH /products/:id', () => {
    test('상품 정보 수정 : name', async () => {
      const agent = request.agent(app);
      await agent.post('/auth/login').send({ email: 'test@test.com', password: 'qwer1234' });

      const user = await prismaClient.user.findUnique({ where: { email: 'test@test.com' } });

      const product = await prismaClient.product.create({
        data: {
          name: '로봇',
          description: '어린이용 변신 로봇',
          price: 5000,
          tags: ['어린이', '장난감'],
          images: ['img1.jpg', 'img1.png'],
          userId: user!.id,
        },
      });

      const updateResponse = await agent.patch(`/products/${product.id}`).send({ name: '인형' });

      expect(updateResponse.status).toBe(201);
      expect(updateResponse.body.name).toBe('인형');
    });

    test('상품 정보 수정 : description', async () => {
      const agent = request.agent(app);
      await agent.post('/auth/login').send({ email: 'test@test.com', password: 'qwer1234' });

      const user = await prismaClient.user.findUnique({ where: { email: 'test@test.com' } });

      const product = await prismaClient.product.create({
        data: {
          name: '로봇',
          description: '어린이용 변신 로봇',
          price: 5000,
          tags: ['어린이', '장난감'],
          images: ['img1.jpg', 'img1.png'],
          userId: user!.id,
        },
      });

      const updateResponse = await agent
        .patch(`/products/${product.id}`)
        .send({ description: '어른용 조립 로봇' });

      expect(updateResponse.status).toBe(201);
      expect(updateResponse.body.description).toBe('어른용 조립 로봇');
    });

    test('상품 정보 수정 : price', async () => {
      const agent = request.agent(app);
      await agent.post('/auth/login').send({ email: 'test@test.com', password: 'qwer1234' });

      const user = await prismaClient.user.findUnique({ where: { email: 'test@test.com' } });

      const product = await prismaClient.product.create({
        data: {
          name: '로봇',
          description: '어린이용 변신 로봇',
          price: 5000,
          tags: ['어린이', '장난감'],
          images: ['img1.jpg', 'img1.png'],
          userId: user!.id,
        },
      });

      const updateResponse = await agent
        .patch(`/products/${product.id}`)
        .send({ price: 100000000 });

      expect(updateResponse.status).toBe(201);
      expect(updateResponse.body.price).toBe(100000000);
    });

    test('상품 정보 수정 : tags', async () => {
      const agent = request.agent(app);
      await agent.post('/auth/login').send({ email: 'test@test.com', password: 'qwer1234' });

      const user = await prismaClient.user.findUnique({ where: { email: 'test@test.com' } });

      const product = await prismaClient.product.create({
        data: {
          name: '로봇',
          description: '어린이용 변신 로봇',
          price: 5000,
          tags: ['어린이', '장난감'],
          images: ['img1.jpg', 'img1.png'],
          userId: user!.id,
        },
      });

      const updateResponse = await agent
        .patch(`/products/${product.id}`)
        .send({ tags: ['조립용', '손조심'] });

      expect(updateResponse.status).toBe(201);
      expect(updateResponse.body.tags).toEqual(['조립용', '손조심']);
    });

    test('상품 정보 수정 : images', async () => {
      const agent = request.agent(app);
      await agent.post('/auth/login').send({ email: 'test@test.com', password: 'qwer1234' });

      const user = await prismaClient.user.findUnique({ where: { email: 'test@test.com' } });

      const product = await prismaClient.product.create({
        data: {
          name: '로봇',
          description: '어린이용 변신 로봇',
          price: 5000,
          tags: ['어린이', '장난감'],
          images: ['img1.jpg', 'img1.png'],
          userId: user!.id,
        },
      });

      const updateResponse = await agent
        .patch(`/products/${product.id}`)
        .send({ images: ['img3.jpg'] });

      expect(updateResponse.status).toBe(201);
      expect(updateResponse.body.images).toEqual(['img3.jpg']);
    });

    test('상품 정보 수정 불가 : 잘못된 상품 id', async () => {
      const agent = request.agent(app);
      await agent.post('/auth/login').send({ email: 'test@test.com', password: 'qwer1234' });

      const user = await prismaClient.user.findUnique({ where: { email: 'test@test.com' } });

      const product = await prismaClient.product.create({
        data: {
          name: '로봇',
          description: '어린이용 변신 로봇',
          price: 5000,
          tags: ['어린이', '장난감'],
          images: ['img1.jpg', 'img1.png'],
          userId: user!.id,
        },
      });

      const updateResponse = await agent
        .patch(`/products/${product.id + 1}`)
        .send({ name: '수정불가' });

      expect(updateResponse.status).toBe(404);
      expect(updateResponse.body.message).toBe(`product with id ${product.id + 1} not found`);
    });

    test('상품 정보 수정 불가 : 현재 상품을 등록하지 않은 다른 사용자', async () => {
      const agent = request.agent(app);
      await agent.post('/auth/login').send({ email: 'test@test.com', password: 'qwer1234' });

      const user = await prismaClient.user.findUnique({ where: { email: 'test@test.com' } });

      const product = await prismaClient.product.create({
        data: {
          name: '로봇',
          description: '어린이용 변신 로봇',
          price: 5000,
          tags: ['어린이', '장난감'],
          images: ['img1.jpg', 'img1.png'],
          userId: user!.id,
        },
      });

      await agent.post('/auth/logout');

      // 다른 사용자로 로그인
      await agent.post('/auth/login').send({ email: 'test2@test.com', password: 'qwer1234' });

      const updateResponse = await agent
        .patch(`/products/${product.id}`)
        .send({ name: '다른 사용자' });

      expect(updateResponse.status).toBe(403);
      expect(updateResponse.body.message).toBe('Should be the owner of the product');
    });
  });

  describe('인증을 거친 후 상품 삭제 DELETE /products/:id', () => {
    test('상품 삭제', async () => {
      const agent = request.agent(app);
      await agent.post('/auth/login').send({ email: 'test@test.com', password: 'qwer1234' });

      const user = await prismaClient.user.findUnique({ where: { email: 'test@test.com' } });

      const product = await prismaClient.product.create({
        data: {
          name: '로봇',
          description: '어린이용 변신 로봇',
          price: 5000,
          tags: ['어린이', '장난감'],
          images: ['img1.jpg', 'img1.png'],
          userId: user!.id,
        },
      });

      const deleteResponse = await agent.delete(`/products/${product.id}`);

      expect(deleteResponse.status).toBe(204);
    });

    test('상품 삭제 불가 : 잘못된 상품 id', async () => {
      const agent = request.agent(app);
      await agent.post('/auth/login').send({ email: 'test@test.com', password: 'qwer1234' });

      const user = await prismaClient.user.findUnique({ where: { email: 'test@test.com' } });

      const product = await prismaClient.product.create({
        data: {
          name: '로봇',
          description: '어린이용 변신 로봇',
          price: 5000,
          tags: ['어린이', '장난감'],
          images: ['img1.jpg', 'img1.png'],
          userId: user!.id,
        },
      });

      const deleteResponse = await agent.delete(`/products/${product.id + 1}`);

      expect(deleteResponse.status).toBe(404);
      expect(deleteResponse.body.message).toBe(`product with id ${product.id + 1} not found`);
    });

    test('상품 삭제 불가 : 현재 상품을 등록하지 않은 다른 사용자 ', async () => {
      const agent = request.agent(app);
      await agent.post('/auth/login').send({ email: 'test@test.com', password: 'qwer1234' });

      const user = await prismaClient.user.findUnique({ where: { email: 'test@test.com' } });

      const product = await prismaClient.product.create({
        data: {
          name: '로봇',
          description: '어린이용 변신 로봇',
          price: 5000,
          tags: ['어린이', '장난감'],
          images: ['img1.jpg', 'img1.png'],
          userId: user!.id,
        },
      });

      await agent.post('/auth/logout');

      await agent.post('/auth/login').send({ email: 'test2@test.com', password: 'qwer1234' });

      const deleteResponse = await agent.delete(`/products/${product.id}`);

      expect(deleteResponse.status).toBe(403);
      expect(deleteResponse.body.message).toBe('Should be the owner of the product');
    });
  });

  // 개별 심화
  // describe('인증을 거친 후 게시글에 댓글 생성 POST /articles', () => {});
  // describe('인증을 거친 후 게시글에 "좋아요" 설정 POST /articles', () => {});
  // describe('인증을 거친 후 게시글에 "좋아요" 취소 DELETE /articles', () => {});
});
