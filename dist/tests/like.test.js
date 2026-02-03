"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const prismaClient_1 = __importDefault(require("../src/libs/prismaClient"));
describe('Like 통합 테스트 (Product & Article)', () => {
    let userToken;
    let productId;
    let articleId;
    beforeAll(async () => {
        await prismaClient_1.default.comment.deleteMany();
        await prismaClient_1.default.article.deleteMany();
        await prismaClient_1.default.product.deleteMany();
        await prismaClient_1.default.user.deleteMany();
        await (0, supertest_1.default)(app_1.default).post('/users/registration').send({
            email: 'liker@example.com',
            nickname: '좋아요러',
            password: 'password123',
        });
        const res = await (0, supertest_1.default)(app_1.default).post('/users/login').send({
            email: 'liker@example.com',
            password: 'password123',
        });
        const cookies = res.headers['set-cookie'];
        userToken = cookies.join(';');
        const pRes = await (0, supertest_1.default)(app_1.default)
            .post('/products')
            .set('Cookie', userToken)
            .send({
            name: '좋아요 상품',
            description: '설명',
            price: 1000,
            tags: [],
        });
        productId = pRes.body.id;
        const aRes = await (0, supertest_1.default)(app_1.default)
            .post('/articles')
            .set('Cookie', userToken)
            .send({
            title: '좋아요 게시글',
            content: '내용',
        });
        articleId = aRes.body.id;
    });
    afterAll(async () => {
        await prismaClient_1.default.product.deleteMany();
        await prismaClient_1.default.article.deleteMany();
        await prismaClient_1.default.user.deleteMany();
        await prismaClient_1.default.$disconnect();
    });
    describe('POST /users/products/:productId', () => {
        test('상품 좋아요 등록 성공 (200/201)', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post(`/users/products/${productId}`)
                .set('Cookie', userToken);
            expect([200, 201]).toContain(res.status);
            expect(res.body).toHaveProperty('message');
        });
        test('상품 좋아요 해제 성공 (200/201/204)', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post(`/users/products/${productId}`)
                .set('Cookie', userToken);
            expect([200, 201, 204]).toContain(res.status);
        });
    });
    describe('POST /users/articles/:articleId', () => {
        test('게시글 좋아요 등록 성공 (200/201)', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post(`/users/articles/${articleId}`)
                .set('Cookie', userToken);
            expect([200, 201]).toContain(res.status);
        });
        test('게시글 좋아요 해제 성공 (200/201/204)', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post(`/users/articles/${articleId}`)
                .set('Cookie', userToken);
            expect([200, 201, 204]).toContain(res.status);
        });
    });
});
//# sourceMappingURL=like.test.js.map