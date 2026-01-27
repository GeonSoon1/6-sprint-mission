import request from 'supertest';
import app from '../src/app';

describe('상품 API 통합 테스트 (인증 불필요)', () => {
  let firstProductId: string;

  test('GET /product - 상품 목록을 성공적으로 조회해야 한다', async () => {
    const res = await request(app).get('/products');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.products)).toBe(true);

    if (res.body.products.length > 0) {
      firstProductId = res.body.products[0].id;
    }
  });

  test('GET /products/:id - 특정 상품을 조회해야 한다.', async () => {
    const targetId = firstProductId || '05c82601-b29c-4f63-a3e3-97d980a7a286';
    const res = await request(app).get(`/products/${targetId}`);

    if (firstProductId) {
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(firstProductId);
    } else {
      expect([200, 404]).toContain(res.status);
    }
  });
});
