export declare class LikeRepository {
    productFindProductById(productId: string): Promise<{
        name: string;
        description: string;
        price: number;
        tags: string[];
        id: string;
        productLikeCount: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    productFindExistingLike(userId: string, productId: string): Promise<{
        productId: string;
        createdAt: Date;
        userId: string;
    } | null>;
    productCreateLike(userId: string, productId: string): Promise<{
        productId: string;
        createdAt: Date;
        userId: string;
    }>;
    productDeleteLike(userId: string, productId: string): Promise<{
        productId: string;
        createdAt: Date;
        userId: string;
    }>;
    productIncrementLike(productId: string): Promise<{
        name: string;
        description: string;
        price: number;
        tags: string[];
        id: string;
        productLikeCount: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    productDecrementLike(productId: string): Promise<{
        name: string;
        description: string;
        price: number;
        tags: string[];
        id: string;
        productLikeCount: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    getLikedProducts(userId: string): Promise<{
        likedProducts: {
            product: {
                name: string;
                description: string;
                price: number;
                tags: string[];
                id: string;
                productLikeCount: number;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
            };
        }[];
    }>;
    articleFindArticleById(articleId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        content: string;
        articleLikeCount: number;
    }>;
    articleFindExistingLike(userId: string, articleId: string): Promise<{
        articleId: string;
        createdAt: Date;
        userId: string;
    } | null>;
    articleCreateLike(userId: string, articleId: string): Promise<{
        articleId: string;
        createdAt: Date;
        userId: string;
    }>;
    articleDeleteLike(userId: string, articleId: string): Promise<{
        articleId: string;
        createdAt: Date;
        userId: string;
    }>;
    articleIncrementLike(articleId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        content: string;
        articleLikeCount: number;
    }>;
    articleDecrementLike(articleId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        content: string;
        articleLikeCount: number;
    }>;
    getLikedArticles(userId: string): Promise<{
        likedArticles: {
            article: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                title: string;
                content: string;
                articleLikeCount: number;
            };
        }[];
    }>;
}
//# sourceMappingURL=like.repository.d.ts.map