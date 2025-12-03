import { CreateArticleDTO, UpdateArticleDTO, ArticleListQueryDTO, ArticleResponseDTO, CreateCommentDTO, CommentListQueryDTO } from '../types/dto.js';
import { Comment } from '@prisma/client';
export declare class ArticleService {
    createArticle(userId: number, data: CreateArticleDTO): Promise<{
        id: number;
        title: string;
        content: string;
        image: string | null;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getArticle(id: number, userId?: number): Promise<ArticleResponseDTO>;
    updateArticle(id: number, userId: number, data: UpdateArticleDTO): Promise<{
        id: number;
        title: string;
        content: string;
        image: string | null;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteArticle(id: number, userId: number): Promise<void>;
    getArticleList(query: ArticleListQueryDTO, userId?: number): Promise<{
        list: ArticleResponseDTO[];
        totalCount: number;
    }>;
    createComment(articleId: number, userId: number, data: CreateCommentDTO): Promise<{
        id: number;
        content: string;
        productId: number | null;
        articleId: number | null;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getCommentList(articleId: number, query: CommentListQueryDTO): Promise<{
        list: Comment[];
        nextCursor: number | null;
    }>;
    createLike(articleId: number, userId: number): Promise<void>;
    deleteLike(articleId: number, userId: number): Promise<void>;
}
export declare const articleService: ArticleService;
//# sourceMappingURL=articleService.d.ts.map