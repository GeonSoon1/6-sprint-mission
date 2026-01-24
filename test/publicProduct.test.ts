import request from 'supertest';
import { prismaClient } from '@lib/prismaClient';
import app from '@/app';
import { userSample, productSample } from '@test/helper/mockdata';
import { createProductsWithUsers } from '@test/helper/product';

describe('인증이 필요하지 않은 상품 API 통합 테스트', () => {
  console.log('public product run!!');

  // 전체 작업을 통틀어 1번만 실행되는 DB 리셋
  beforeAll(async () => {
    // DB 데이터 삭제는 가장 관계 설정이 적은 단위부터 시행
    await prismaClient.notification.deleteMany();
    await prismaClient.like.deleteMany();
    await prismaClient.favorite.deleteMany();
    await prismaClient.comment.deleteMany();
    await prismaClient.article.deleteMany();
  });

  // test마다 실행 될 DB 리셋
  beforeEach(async () => {
    await prismaClient.product.deleteMany();
    await prismaClient.user.deleteMany();
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  describe('인증 없이 상품 리스트 조회 GET /products/', () => {
    test('상품이 없는 경우 빈 배열 반환', async () => {
      const response = await request(app).get('/products');
      expect(response.status).toBe(200);
      expect(response.body.list).toEqual([]);
      expect(response.body.totalCount).toBe(0);
    });

    test('상품이 있고, query가 없는 경우 모든 데이터 반환', async () => {
      // 상품 등록 로직 실행
      await createProductsWithUsers(userSample, productSample);

      const response = await request(app).get('/products');
      expect(response.status).toBe(200);
      expect(response.body.list.length).toBe(10);
      expect(response.body.totalCount).toBe(24);
      expect(response.body.list[0].name).toBe('로봇');
    });

    test('query : Page / PageSize 테스트', async () => {
      // 상품 등록 로직 실행
      await createProductsWithUsers(userSample, productSample);

      const response = await request(app).get('/products').query({ page: 2, pageSize: 5 });
      expect(response.status).toBe(200);
      expect(response.body.list.length).toBe(5);
      expect(response.body.list[0].name).toBe('레인보우 블록');
    });

    test('query : orderBy 테스트', async () => {
      // 상품 등록 로직 실행
      await createProductsWithUsers(userSample, productSample);

      const response = await request(app).get('/products').query({ orderBy: 'oldest' });
      expect(response.status).toBe(200);
      expect(response.body.list[0].name).toBe('로봇');
    });

    test('query : keyword 테스트', async () => {
      // 상품 등록 로직 실행
      await createProductsWithUsers(userSample, productSample);

      // 키워드가 상품명에 있는 경우
      const response1 = await request(app).get('/products').query({ keyword: '미니' });
      expect(response1.status).toBe(200);
      expect(response1.body.list.length).toBe(3);

      // 키워드가 상품명에 없는 경우 -> 프론트에서 없는 화면 처리 필요 ㅎ
      const response2 = await request(app).get('/products').query({ keyword: '메롱' });
      expect(response2.status).toBe(200);
      expect(response2.body.list.length).toBe(0);
    });
  });

  describe('인증 없이 상품 상세 조회 GET /products/:id', () => {
    test('인증 없이 상품 상세 조회', async () => {
      // 상품 등록 로직 실행
      const user = await prismaClient.user.create({ data: userSample[0] });

      const product = await prismaClient.product.create({
        data: {
          ...productSample[0],
          userId: user.id,
        },
      });

      const response = await request(app).get(`/products/${product.id}`);
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('로봇');
    });

    test('존재하지 않는 상품 상세 조회', async () => {
      const user = await prismaClient.user.create({ data: userSample[0] });
      const product = await prismaClient.product.create({
        data: {
          ...productSample[0],
          userId: user.id,
        },
      });

      const response = await request(app).get(`/products/${product.id + 1}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`product with id ${product.id + 1} not found`);
    });
  });
});
