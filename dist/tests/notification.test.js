"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const prismaClient_1 = __importDefault(require("../src/libs/prismaClient"));
describe('Notification 통합 테스트', () => {
    let userToken;
    let uniqueEmail;
    beforeAll(async () => {
        await prismaClient_1.default.notification.deleteMany();
        await prismaClient_1.default.user.deleteMany();
        uniqueEmail = `noti_${Date.now()}@example.com`;
        await (0, supertest_1.default)(app_1.default).post('/users/registration').send({
            email: uniqueEmail,
            nickname: '알림유저',
            password: 'password123',
        });
        const res = await (0, supertest_1.default)(app_1.default).post('/users/login').send({
            email: uniqueEmail,
            password: 'password123',
        });
        const cookies = res.headers['set-cookie'];
        userToken = cookies.join(';');
        const user = await prismaClient_1.default.user.findUnique({
            where: { email: uniqueEmail },
        });
        await prismaClient_1.default.notification.create({
            data: {
                userId: user.id,
                message: '테스트 알림입니다.',
            },
        });
    });
    afterAll(async () => {
        await prismaClient_1.default.notification.deleteMany();
        await prismaClient_1.default.user.deleteMany();
        await prismaClient_1.default.$disconnect();
    });
    describe('GET /notifications', () => {
        test('알림 목록 조회 성공 (200)', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get('/notifications')
                .set('Cookie', userToken);
            expect(res.status).toBe(200);
            if (res.body.list) {
                expect(Array.isArray(res.body.list)).toBe(true);
                expect(res.body.list.length).toBeGreaterThan(0);
            }
            else {
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body.length).toBeGreaterThan(0);
            }
        });
    });
    describe('GET /notifications/unread-count', () => {
        test('안 읽은 알림 개수 조회 성공 (200)', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get('/notifications/unread-count')
                .set('Cookie', userToken);
            expect(res.status).toBe(200);
            expect(typeof res.body.count).toBe('number');
        });
    });
    describe('PATCH /notifications/:id/read', () => {
        test('알림 읽음 처리 성공 (200) 및 안 읽은 개수 감소 확인', async () => {
            const user = await prismaClient_1.default.user.findUnique({
                where: { email: uniqueEmail },
            });
            const notification = await prismaClient_1.default.notification.findFirst({
                where: { userId: user.id },
            });
            const notificationId = notification?.id;
            if (!notificationId) {
                throw new Error('Notification verification failed: No notification found for test user');
            }
            const readRes = await (0, supertest_1.default)(app_1.default)
                .patch(`/notifications/${notificationId}/read`)
                .set('Cookie', userToken);
            expect(readRes.status).toBe(200);
            expect(readRes.body.message).toBe('Notification read');
            const countRes = await (0, supertest_1.default)(app_1.default)
                .get('/notifications/unread-count')
                .set('Cookie', userToken);
            expect(countRes.status).toBe(200);
            expect(countRes.body.count).toBe(0);
        });
    });
});
//# sourceMappingURL=notification.test.js.map