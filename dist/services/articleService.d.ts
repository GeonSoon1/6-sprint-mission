import { ArticleFindOptions } from './../libs/interfaces';
declare class ArticleService {
    likeArticle(userId: number, articleId: number): Promise<{
        liked: boolean;
    }>;
    getArticleById(articleId: number, userId: number): Promise<{
        isLiked: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
    }>;
    getArticles(findOptions: ArticleFindOptions, userId: number): Promise<{
        isLiked: boolean;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
    }[]>;
}
export declare const articleService: ArticleService;
export {};
//# sourceMappingURL=articleService.d.ts.map