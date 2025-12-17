import articleLikeRepository from '../repositories/articleLikeRepository';
import articleRepository from '../repositories/articleRepository';
import { ArticleFindOptions } from './../libs/interfaces';

class ArticleService {
    async likeArticle(userId: number, articleId: number) {
        const existingLike = await articleLikeRepository.find(userId, articleId);

        if (existingLike) {
            await articleLikeRepository.remove(existingLike.id);
            return { liked: false };
        }

        await articleLikeRepository.create(userId, articleId);
        return { liked: true };
    }

    async getArticleById(articleId: number, userId: number) {
        const article = await articleRepository.findById(articleId, userId);
        const { articleLikes, ...rest } = article;
        return { ...rest, isLiked: articleLikes.length > 0 };
    }

    async getArticles(findOptions: ArticleFindOptions, userId: number) {
        const articles = await articleRepository.findAll(findOptions, userId);
        return articles.map((article) => {
            const { articleLikes, ...rest } = article;
            return { ...rest, isLiked: articleLikes.length > 0 };
        });
    }
}

export const articleService = new ArticleService();
