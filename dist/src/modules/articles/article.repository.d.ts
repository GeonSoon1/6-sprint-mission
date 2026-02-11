import { Prisma } from '@prisma/client';
import { ArticleCreateDto } from '../articles/article.dto';
export declare class ArticleRepogitory {
    create(data: ArticleCreateDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        content: string;
        articleLikeCount: number;
    }>;
    findMany(params: {
        where: Prisma.ArticleWhereInput;
        orderBy: Prisma.ArticleOrderByWithRelationInput;
        skip: number;
        take: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        content: string;
        articleLikeCount: number;
    }[]>;
    findUserLikedArticles(userId: string): Promise<string[]>;
    findById(id: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        content: string;
        articleLikeCount: number;
    } | null>;
    checkUserLiked(userId: string, articleId: string): Promise<{
        articleId: string;
        createdAt: Date;
        userId: string;
    } | null>;
    update(id: string, data: Prisma.ArticleUpdateInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        content: string;
        articleLikeCount: number;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        content: string;
        articleLikeCount: number;
    }>;
    findByUserId(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        content: string;
        articleLikeCount: number;
    }[]>;
    findUserId(id: string): Promise<string | undefined>;
}
//# sourceMappingURL=article.repository.d.ts.map