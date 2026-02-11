"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const prismaClient_1 = __importDefault(require("../src/libs/prismaClient"));
describe('User 통합 테스트', () => {
    let userToken;
    let refreshToken;
    beforeAll(async () => {
        await prismaClient_1.default.notification.deleteMany();
        await prismaClient_1.default.comment.deleteMany();
        await prismaClient_1.default.likedArticle.deleteMany();
        await prismaClient_1.default.likedProduct.deleteMany();
        await prismaClient_1.default.article.deleteMany();
        await prismaClient_1.default.product.deleteMany();
        await prismaClient_1.default.user.deleteMany();
        await (0, supertest_1.default)(app_1.default).post('/users/registration').send({
            email: 'user@example.com',
            nickname: '일반유저',
            password: 'password123',
        });
        const res = await (0, supertest_1.default)(app_1.default).post('/users/login').send({
            email: 'user@example.com',
            password: 'password123',
        });
        const cookies = res.headers['set-cookie'];
        userToken = cookies.join(';');
    });
    afterAll(async () => {
        await prismaClient_1.default.user.deleteMany();
        await prismaClient_1.default.$disconnect();
    });
    describe('GET /users/user/profile', () => {
        test('내 프로필 조회 성공 (200)', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get('/users/user/profile')
                .set('Cookie', userToken);
            expect(res.status).toBe(200);
            expect(res.body.email).toBe('user@example.com');
        });
        test('인증 없이 프로필 조회 실패 (401)', async () => {
            const res = await (0, supertest_1.default)(app_1.default).get('/users/user/profile');
            expect(res.status).toBe(401);
        });
    });
    describe('PATCH /users/user/update (닉네임)', () => {
        test('프로필 수정 성공 (200)', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .patch('/users/user/update')
                .set('Cookie', userToken)
                .send({
                nickname: '수정된닉네임',
                password: 'password123',
            });
            expect(res.status).toBe(200);
            expect(res.body.nickname).toBe('수정된닉네임');
        });
    });
    describe('PATCH /users/user/update (비밀번호)', () => {
        test('비밀번호 변경 성공 (200) 및 새 로그인', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .patch('/users/user/update')
                .set('Cookie', userToken)
                .send({
                nickname: '비번변경유저',
                password: 'password123',
                newPassword: 'newPassword123',
            });
            expect(res.status).toBe(200);
            const loginRes = await (0, supertest_1.default)(app_1.default).post('/users/login').send({
                email: 'user@example.com',
                password: 'newPassword123',
            });
            expect(loginRes.status).toBe(200);
            userToken = loginRes.headers['set-cookie'].join(';');
        });
    });
    describe('POST /users/token/refresh', () => {
        test('토큰 갱신 성공 (200)', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/users/token/refresh')
                .set('Cookie', userToken);
            expect(res.status).toBe(200);
            const cookies = res.headers['set-cookie'];
            expect(cookies).toBeDefined();
            expect(JSON.stringify(cookies)).toContain('accessToken');
        });
    });
    describe('GET /users/user/products', () => {
        test('나의 상품 목록 조회 성공 (200)', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get('/users/user/products')
                .set('Cookie', userToken);
            expect(res.status).toBe(200);
        });
    });
    describe('GET /users/user/articles', () => {
        test('나의 게시글 목록 조회 성공 (200)', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get('/users/user/articles')
                .set('Cookie', userToken);
            expect(res.status).toBe(200);
        });
    });
    describe('GET /users/products/like', () => {
        test('좋아요한 상품 목록 조회 성공 (200)', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get('/users/products/like')
                .set('Cookie', userToken);
            expect(res.status).toBe(200);
        });
    });
    describe('GET /users/articles/like', () => {
        test('좋아요한 게시글 목록 조회 성공 (200)', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get('/users/articles/like')
                .set('Cookie', userToken);
            expect(res.status).toBe(200);
        });
    });
    describe('POST /users/logout', () => {
        test('로그아웃 성공 (200)', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/users/logout')
                .set('Cookie', userToken);
            expect(res.status).toBe(200);
            const cookies = res.headers['set-cookie'];
            expect(cookies).toBeDefined();
        });
    });
});
//# sourceMappingURL=user.test.js.map