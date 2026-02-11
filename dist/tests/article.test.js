"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const prismaClient_1 = __importDefault(require("../src/libs/prismaClient"));
describe('Article 통합 테스트', () => {
    let userToken;
    let articleId;
    beforeAll(async () => {
        await prismaClient_1.default.article.deleteMany();
        await prismaClient_1.default.product.deleteMany();
        await prismaClient_1.default.user.deleteMany();
        await (0, supertest_1.default)(app_1.default).post('/users/registration').send({
            email: 'writer@example.com',
            nickname: '작가',
            password: 'password123',
        });
        const res = await (0, supertest_1.default)(app_1.default).post('/users/login').send({
            email: 'writer@example.com',
            password: 'password123',
        });
        const cookies = res.headers['set-cookie'];
        userToken = cookies.join(';');
    });
    afterAll(async () => {
        await prismaClient_1.default.article.deleteMany();
        await prismaClient_1.default.user.deleteMany();
        await prismaClient_1.default.$disconnect();
    });
    describe('POST /articles', () => {
        test('게시글 생성 성공 (201)', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/articles')
                .set('Cookie', userToken)
                .send({
                title: '첫 번째 게시글',
                content: '안녕하세요, 게시글 내용입니다.',
            });
            expect(res.status).toBe(201);
            expect(res.body.title).toBe('첫 번째 게시글');
            articleId = res.body.id;
        });
        test('게시글 생성 실패 - 인증 없음 (401)', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/articles').send({
                title: '실패할 게시글',
                content: '내용',
            });
            expect(res.status).toBe(401);
        });
    });
    describe('GET /articles', () => {
        test('게시글 목록 조회 성공 (200)', async () => {
            const res = await (0, supertest_1.default)(app_1.default).get('/articles');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });
    describe('GET /articles/:id', () => {
        test('게시글 상세 조회 성공 (200)', async () => {
            const res = await (0, supertest_1.default)(app_1.default).get(`/articles/${articleId}`);
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(articleId);
        });
        test('게시글 상세 조회 실패 - 없는 ID (404)', async () => {
            const res = await (0, supertest_1.default)(app_1.default).get('/articles/11111111-1111-4111-8111-111111111111');
            expect(res.status).toBe(404);
        });
    });
    describe('PATCH /articles/:id', () => {
        test('게시글 수정 성공 (200)', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .patch(`/articles/${articleId}`)
                .set('Cookie', userToken)
                .send({
                title: '수정된 게시글 제목',
            });
            expect(res.status).toBe(200);
            expect(res.body.title).toBe('수정된 게시글 제목');
        });
    });
    describe('DELETE /articles/:id', () => {
        test('게시글 삭제 성공 (204)', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .delete(`/articles/${articleId}`)
                .set('Cookie', userToken);
            expect(res.status).toBe(204);
        });
    });
    describe('GET /articles (Search & Sort)', () => {
        test('게시글 검색 및 정렬 조회 성공 (200)', async () => {
            const uniqueKeyword = `자바스크립트_${Date.now()}`;
            await (0, supertest_1.default)(app_1.default)
                .post('/articles')
                .set('Cookie', userToken)
                .send({
                title: `검색대상 ${uniqueKeyword}`,
                content: '내용',
            });
            await (0, supertest_1.default)(app_1.default).post('/articles').set('Cookie', userToken).send({
                title: '파이썬 기초',
                content: '내용',
            });
            const searchRes = await (0, supertest_1.default)(app_1.default)
                .get(`/articles?search=${uniqueKeyword}`)
                .set('Cookie', userToken);
            expect(searchRes.status).toBe(200);
            const list = Array.isArray(searchRes.body)
                ? searchRes.body
                : searchRes.body.list;
            if (list && list.length > 0) {
                expect(list[0].title).toContain(uniqueKeyword);
            }
            await (0, supertest_1.default)(app_1.default).get('/articles?page=0&limit=abc').expect(200);
            const sortRes = await (0, supertest_1.default)(app_1.default)
                .get('/articles?sort=recent')
                .set('Cookie', userToken);
            expect(sortRes.status).toBe(200);
            const sortList = Array.isArray(sortRes.body)
                ? sortRes.body
                : sortRes.body.list;
            expect(sortList.length).toBeGreaterThan(0);
        });
        test('좋아요 누른 게시글 목록 조회 시 isLiked: true 확인', async () => {
            const newArticleRes = await (0, supertest_1.default)(app_1.default)
                .post('/articles')
                .set('Cookie', userToken)
                .send({ title: '좋아요 테스트글', content: '내용' });
            const newArticleId = newArticleRes.body.id;
            await (0, supertest_1.default)(app_1.default)
                .post(`/users/articles/${newArticleId}`)
                .set('Cookie', userToken);
            const listRes = await (0, supertest_1.default)(app_1.default)
                .get('/articles')
                .set('Cookie', userToken);
            expect(listRes.status).toBe(200);
            const list = Array.isArray(listRes.body)
                ? listRes.body
                : listRes.body.list;
            const target = list.find((a) => a.id === newArticleId);
            expect(target).toBeDefined();
            expect(target.isLiked).toBe(true);
        });
    });
    describe('DELETE /articles/:id (권한 없음)', () => {
        let targetId;
        beforeEach(async () => {
            const articleRes = await (0, supertest_1.default)(app_1.default)
                .post('/articles')
                .set('Cookie', userToken)
                .send({ title: '권한 테스트용 삭제', content: '내용' });
            targetId = articleRes.body.id;
        });
        test('남의 게시글 삭제 실패 (403)', async () => {
            const hackerEmail = `hacker_${Date.now()}_${Math.floor(Math.random() * 1000)}@example.com`;
            await (0, supertest_1.default)(app_1.default).post('/users/registration').send({
                email: hackerEmail,
                nickname: '해커',
                password: 'password123',
            });
            const loginRes = await (0, supertest_1.default)(app_1.default).post('/users/login').send({
                email: hackerEmail,
                password: 'password123',
            });
            const hackerToken = loginRes.headers['set-cookie'].join(';');
            const res = await (0, supertest_1.default)(app_1.default)
                .delete(`/articles/${targetId}`)
                .set('Cookie', hackerToken);
            expect(res.status).toBe(403);
        });
    });
});
//# sourceMappingURL=article.test.js.map