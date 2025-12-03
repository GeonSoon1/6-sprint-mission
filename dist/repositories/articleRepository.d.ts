import { Article, Like } from '@prisma/client';
import { CreateArticleDTO, UpdateArticleDTO, ArticleListQueryDTO } from '../types/dto.js';
export declare class ArticleRepository {
    findById(id: number): Promise<(Article & {
        likes: Like[];
    }) | null>;
    findMany(query: ArticleListQueryDTO): Promise<(Article & {
        likes: Like[];
    })[]>;
    count(query: ArticleListQueryDTO): Promise<number>;
    create(data: CreateArticleDTO & {
        userId: number;
    }): Promise<Article>;
    update(id: number, data: UpdateArticleDTO): Promise<Article>;
    delete(id: number): Promise<void>;
}
export declare const articleRepository: ArticleRepository;
//# sourceMappingURL=articleRepository.d.ts.map