"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
describe('Image Upload 통합 테스트', () => {
    const uploadDir = 'uploads';
    const testFilePath = path_1.default.join(__dirname, 'test-image.png');
    beforeAll(() => {
        fs_1.default.writeFileSync(testFilePath, 'dummy image content');
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir);
        }
    });
    afterAll(() => {
        if (fs_1.default.existsSync(testFilePath)) {
            fs_1.default.unlinkSync(testFilePath);
        }
    });
    test('POST /images - 이미지 업로드 성공 (200)', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/images')
            .attach('image', testFilePath);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('imageUrl');
        expect(res.body.imageUrl).toMatch(/uploads\//);
    });
    test('POST /images - 파일 누락 시 400 반환', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/images').field('dummy', 'true');
        expect(res.status).toBe(400);
    });
});
//# sourceMappingURL=image.test.js.map