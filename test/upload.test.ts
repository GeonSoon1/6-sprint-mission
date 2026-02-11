import request from 'supertest';
import app from '../src/main';
import path from 'path';

describe('Upload API Integration Tests', () => {
    it('POST /upload - should upload image to S3 and return URL', async () => {
        // 테스트에 사용할 이미지 파일 경로
        const filePath = path.join(__dirname, 'testimage.jpg');

        // API 요청 (라우터 경로가 /upload 라고 가정)
        const res = await request(app)
            .post('/upload')
            .attach('attachment', filePath); // uploadRouter에서 설정한 필드명 'attachment'

        // 검증
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('url');
        // 반환된 URL이 http 또는 https로 시작하는지 확인 (S3 URL 형식)
        expect(res.body.url).toMatch(/^https?:\/\//);

        console.log('Uploaded S3 URL:', res.body.url);
    });
});
