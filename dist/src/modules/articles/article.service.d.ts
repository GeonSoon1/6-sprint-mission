import { Article } from '@prisma/client';
import { ArticleCreateDto, ArticleQueryDto, ArticleUpdateDto } from '../articles/article.dto';
import { ArticleRepogitory } from '../articles/article.repository';
type GetArticleData = Omit<Article, 'likedArticles' | 'userId' | 'updatedAt'> & {
    isLiked?: boolean;
};
type getArticleById = Omit<Article, 'updatedAt' | 'userId'> & {
    isLiked?: boolean;
};
export declare class ArticleService {
    private repo;
    constructor(repo: ArticleRepogitory);
    create(dto: ArticleCreateDto): Promise<Article>;
    getArticles(dto: ArticleQueryDto): Promise<GetArticleData[]>;
    getById(id: string, userId?: string | null): Promise<getArticleById>;
    update(id: string, dto: ArticleUpdateDto): Promise<Article>;
    delete(id: string): Promise<void>;
    getUserArticles(userId: string): Promise<Article[]>;
}
export {};
//# sourceMappingURL=article.service.d.ts.map