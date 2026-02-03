"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeService = void 0;
class LikeService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    // Product
    async toggleProductLike(userId, productId) {
        await this.repo.productFindProductById(productId); // 존재 확인
        const existing = await this.repo.productFindExistingLike(userId, productId);
        if (!existing) {
            await this.repo.productCreateLike(userId, productId);
            await this.repo.productIncrementLike(productId);
            return '상품 좋아요 등록';
        }
        else {
            await this.repo.productDeleteLike(userId, productId);
            await this.repo.productDecrementLike(productId);
            return '상품 좋아요 해제';
        }
    }
    async getLikedProducts(userId) {
        const data = await this.repo.getLikedProducts(userId);
        return data.likedProducts.map((l) => l.product); // product 목록만 반환
    }
    // Article
    async toggleArticleLike(userId, articleId) {
        await this.repo.articleFindArticleById(articleId);
        const existing = await this.repo.articleFindExistingLike(userId, articleId);
        if (!existing) {
            await this.repo.articleCreateLike(userId, articleId);
            await this.repo.articleIncrementLike(articleId);
            return '게시글 좋아요 등록';
        }
        else {
            await this.repo.articleDeleteLike(userId, articleId);
            await this.repo.articleDecrementLike(articleId);
            return '게시글 좋아요 해제';
        }
    }
    async getLikedArticles(userId) {
        const data = await this.repo.getLikedArticles(userId);
        return data.likedArticles.map((i) => i.article); // article 목록만 넘겨줌
    }
}
exports.LikeService = LikeService;
//# sourceMappingURL=like.service.js.map