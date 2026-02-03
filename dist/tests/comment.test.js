"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const prismaClient_1 = __importDefault(require("../src/libs/prismaClient"));
describe('Comment 통합 테스트', () => {
    let userToken;
    let articleId;
    let productId;
    let commentId;
    beforeAll(async () => {
        await prismaClient_1.default.comment.deleteMany();
        await prismaClient_1.default.article.deleteMany();
        await prismaClient_1.default.product.deleteMany();
        await prismaClient_1.default.user.deleteMany();
        await (0, supertest_1.default)(app_1.default).post('/users/registration').send({
            email: 'commenter@example.com',
            nickname: '댓글러',
            password: 'password123',
        });
        const res = await (0, supertest_1.default)(app_1.default).post('/users/login').send({
            email: 'commenter@example.com',
            password: 'password123',
        });
        const cookies = res.headers['set-cookie'];
        userToken = cookies.join(';');
        const articleRes = await (0, supertest_1.default)(app_1.default)
            .post('/articles')
            .set('Cookie', userToken)
            .send({
            title: '댓글 테스트용 게시글',
            content: '내용',
        });
        articleId = articleRes.body.id;
        const productRes = await (0, supertest_1.default)(app_1.default)
            .post('/products')
            .set('Cookie', userToken)
            .send({
            name: '댓글 테스트용 상품',
            description: '설명',
            price: 1000,
            tags: [],
        });
        productId = productRes.body.id;
    });
    afterAll(async () => {
        await prismaClient_1.default.comment.deleteMany();
        await prismaClient_1.default.article.deleteMany();
        await prismaClient_1.default.product.deleteMany();
        await prismaClient_1.default.user.deleteMany();
        await prismaClient_1.default.$disconnect();
    });
    describe('POST /comments/article/:articleId', () => {
        test('게시글 댓글 생성 성공 (201)', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post(`/comments/article/${articleId}`)
                .set('Cookie', userToken)
                .send({
                content: '게시글 댓글입니다.',
            });
            expect(res.status).toBe(201);
            expect(res.body.content).toBe('게시글 댓글입니다.');
            commentId = res.body.id;
        });
    });
    describe('POST /comments/product/:productId', () => {
        test('상품 댓글 생성 성공 (201)', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post(`/comments/product/${productId}`)
                .set('Cookie', userToken)
                .send({
                content: '상품 댓글입니다.',
            });
            expect(res.status).toBe(201);
            expect(res.body.content).toBe('상품 댓글입니다.');
        });
    });
    describe('GET /comments/article/:articleId', () => {
        test('게시글 댓글 목록 조회 성공 (200)', async () => {
            const res = await (0, supertest_1.default)(app_1.default).get(`/comments/article/${articleId}`);
            expect(res.status).toBe(200);
            const list = res.body.list || res.body;
            expect(Array.isArray(list)).toBe(true);
            await (0, supertest_1.default)(app_1.default)
                .get(`/comments/article/${articleId}?limit=abc`)
                .expect(200);
        });
    });
    describe('PATCH /comments/:id', () => {
        test('댓글 수정 성공 (200)', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .patch(`/comments/${commentId}`)
                .set('Cookie', userToken)
                .send({
                content: '수정된 댓글입니다.',
            });
            expect(res.status).toBe(200);
            expect(res.body.content).toBe('수정된 댓글입니다.');
        });
    });
    describe('DELETE /comments/:id', () => {
        test('댓글 삭제 성공 (204)', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .delete(`/comments/${commentId}`)
                .set('Cookie', userToken);
            expect(res.status).toBe(204);
        });
    });
});
//# sourceMappingURL=comment.test.js.map