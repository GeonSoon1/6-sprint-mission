import { Article, Product } from '@prisma/client';
import { LikeRepository } from '../likes/like.repository';
export declare class LikeService {
    private repo;
    constructor(repo: LikeRepository);
    toggleProductLike(userId: string, productId: string): Promise<'상품 좋아요 등록' | '상품 좋아요 해제'>;
    getLikedProducts(userId: string): Promise<Product[]>;
    toggleArticleLike(userId: string, articleId: string): Promise<'게시글 좋아요 등록' | '게시글 좋아요 해제'>;
    getLikedArticles(userId: string): Promise<Article[]>;
}
//# sourceMappingURL=like.service.d.ts.map