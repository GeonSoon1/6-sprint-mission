"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jest_mock_extended_1 = require("jest-mock-extended");
const product_service_1 = require("../../src/modules/products/product.service");
describe('ProductService Unit Test', () => {
    let service;
    let repo;
    let notiService;
    beforeEach(() => {
        repo = (0, jest_mock_extended_1.mock)();
        notiService = (0, jest_mock_extended_1.mock)();
        service = new product_service_1.ProductService(repo, notiService);
    });
    describe('update', () => {
        const productId = 'product-1';
        const oldPrice = 10000;
        const oldProduct = {
            id: productId,
            name: 'Old Product',
            description: 'Old Description',
            price: oldPrice,
            tags: ['old'],
            userId: 'test-user-id',
            productLikeCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        it('가격이 변경되면 관심 등록한 유저들에게 알림을 발송해야 한다', async () => {
            const newPrice = 8000;
            const likerIds = ['user-1', 'user-2'];
            repo.findById.mockResolvedValue(oldProduct);
            repo.update.mockResolvedValue({ ...oldProduct, price: newPrice });
            repo.findLikers.mockResolvedValue(likerIds);
            notiService.create.mockResolvedValue({});
            await service.update(productId, {
                price: newPrice,
                userId: 'test-user-id',
            });
            expect(repo.findById).toHaveBeenCalledWith(productId);
            expect(repo.update).toHaveBeenCalledWith(productId, {
                price: newPrice,
                userId: 'test-user-id',
            });
            expect(repo.findLikers).toHaveBeenCalledWith(productId);
            expect(notiService.create).toHaveBeenCalledTimes(likerIds.length);
            expect(notiService.create).toHaveBeenCalledWith(likerIds[0], expect.stringContaining('8000원'));
            expect(notiService.create).toHaveBeenCalledWith(likerIds[1], expect.stringContaining('8000원'));
        });
        it('가격이 변경되지 않으면 알림을 발송하지 않아야 한다', async () => {
            const samePrice = 10000;
            repo.findById.mockResolvedValue(oldProduct);
            repo.update.mockResolvedValue({ ...oldProduct, price: samePrice });
            await service.update(productId, {
                price: samePrice,
                userId: 'test-user-id',
            });
            expect(repo.update).toHaveBeenCalledWith(productId, {
                price: samePrice,
                userId: 'test-user-id',
            });
            expect(repo.findLikers).not.toHaveBeenCalled();
            expect(notiService.create).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=product.service.test.js.map