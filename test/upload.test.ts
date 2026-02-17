import request from 'supertest';
import app from '../src/main';
import path from 'path';
import fs from 'fs';

describe('Upload API Integration Tests', () => {
    const filePath = path.join(__dirname, 'testimage.jpg');
    let accessToken: string;

    beforeAll(async () => {
        // 테스트 실행 전 더미 이미지 파일 생성
        fs.writeFileSync(filePath, 'dummy image content');

        const user = {
            email: `upload_tester_${Date.now()}@test.com`,
            nickname: `uploader_${Date.now()}`,
            password: 'password123'
        };
        await request(app).post('/auth/signup').send(user);
        const res = await request(app).post('/auth/login').send({ email: user.email, password: user.password });
        accessToken = res.body.accessToken;
    });

    afterAll(() => {
        // 테스트 종료 후 파일 삭제
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    });

    it('POST /upload - should upload image to S3 and return URL', async () => {
        // 테스트에 사용할 이미지 파일 경로

        // API 요청 (라우터 경로가 /upload 라고 가정)
        const res = await request(app)
            .post('/files')
            .set('Authorization', `Bearer ${accessToken}`)
            .attach('attachment', filePath); // uploadRouter에서 설정한 필드명 'attachment'

        // 검증
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('url');
        // 반환된 URL이 http 또는 https로 시작하는지 확인 (S3 URL 형식)
        expect(res.body.url).toMatch(/^https?:\/\//);

        console.log('Uploaded S3 URL:', res.body.url);
    });
});
