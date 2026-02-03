"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const prismaClient_1 = __importDefault(require("../src/libs/prismaClient"));
describe('Auth 통합 테스트', () => {
    beforeAll(async () => {
        await prismaClient_1.default.user.deleteMany();
    });
    afterAll(async () => {
        await prismaClient_1.default.user.deleteMany();
        await prismaClient_1.default.$disconnect();
    });
    describe('POST /users/registration', () => {
        test('회원가입 성공 (201)', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/users/registration').send({
                email: 'test@example.com',
                nickname: '테스터',
                password: 'password123',
            });
            expect(res.status).toBe(201);
            expect(res.body.email).toBe('test@example.com');
        });
        test('회원가입 실패 - 중복 이메일 (409 or 400)', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/users/registration').send({
                email: 'test@example.com',
                nickname: '테스터2',
                password: 'password123',
            });
            expect(res.status).not.toBe(201);
        });
    });
    describe('POST /users/login', () => {
        test('로그인 성공 (200)', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/users/login').send({
                email: 'test@example.com',
                password: 'password123',
            });
            expect(res.status).toBe(200);
            const cookies = res.headers['set-cookie'];
            expect(cookies).toBeDefined();
            expect(cookies.some((cookie) => cookie.includes('accessToken'))).toBe(true);
        });
        test('로그인 실패 - 비밀번호 불일치 (401 or 400)', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/users/login').send({
                email: 'test@example.com',
                password: 'wrongpassword',
            });
            expect(res.status).not.toBe(200);
        });
    });
});
//# sourceMappingURL=auth.test.js.map