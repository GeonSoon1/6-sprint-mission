"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
class ProductService {
    repo;
    notificationService;
    constructor(repo, notificationService) {
        this.repo = repo;
        this.notificationService = notificationService;
    }
    async create(dto) {
        return this.repo.create(dto);
    }
    async getProducts(dto) {
        const products = await this.repo.findAll(dto);
        if (!dto.userId)
            return products;
        const likedProductIds = await this.repo.findLikedProductsByUser(dto.userId);
        return products.map((p) => ({
            ...p,
            isLiked: likedProductIds.includes(p.id),
        }));
    }
    async getById(id, userId) {
        const product = await this.repo.findById(id);
        if (!userId)
            return product;
        const liked = await this.repo.findLikedByUser(userId, id);
        return {
            ...product,
            isLiked: !!liked,
        };
    }
    async update(id, dto) {
        // 1. 기존 상품 정보 가져오기 (가격 비교용)
        const oldProduct = await this.repo.findById(id);
        // 2. 상품 업데이트
        const updatedProduct = await this.repo.update(id, dto);
        // 3. 가격 변동 체크 및 알림 발송
        if (dto.price && oldProduct.price !== dto.price) {
            const message = `관심 상품 '${updatedProduct.name}'의 가격이 ${oldProduct.price}원에서 ${updatedProduct.price}원으로 변경되었습니다.`;
            const likerIds = await this.repo.findLikers(id);
            // 모든 liker에게 알림 전송 (Promise.all로 병렬 처리)
            await Promise.all(likerIds.map((userId) => this.notificationService.create(userId, message)));
        }
        return updatedProduct;
    }
    async delete(id) {
        await this.repo.delete(id);
    }
    async getUserProducts(userId) {
        return this.repo.findByUserId(userId);
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map