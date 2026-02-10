import request from 'supertest';
import app from '../src/app';

describe('게시글 API 통합 테스트 (인증 불필요)', () => {
  let firstArticleId: string;

  test('GET /articles - 게시글 목록 조회', async () => {
    const res = await request(app).get('/articles');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      firstArticleId = res.body[0].id;
    }
  });

  test('GET /articles/:id - 게시글 상세 조회', async () => {
    const targetId = firstArticleId || '09f1d959-1a27-4ad7-b705-f2ec1371042d';
    const res = await request(app).get(`/articles/${targetId}`);

    if (firstArticleId) {
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(firstArticleId);
    } else {
      expect([200, 404]).toContain(res.status);
    }
  });
});
