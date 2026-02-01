import request from 'supertest';
import app from '../src/app';
import path from 'path';
import fs from 'fs';

describe('Image Upload 통합 테스트', () => {
  const uploadDir = 'uploads';

  const testFilePath = path.join(__dirname, 'test-image.png');

  beforeAll(() => {
    fs.writeFileSync(testFilePath, 'dummy image content');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
  });

  afterAll(() => {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  test('POST /images - 이미지 업로드 성공 (200)', async () => {
    const res = await request(app)
      .post('/images')
      .attach('image', testFilePath);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('imageUrl');
    expect(res.body.imageUrl).toMatch(/uploads\//);
  });

  test('POST /images - 파일 누락 시 400 반환', async () => {
    const res = await request(app).post('/images').field('dummy', 'true');

    expect(res.status).toBe(400);
  });
});
