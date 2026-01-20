import articleRepository from '../repository/articleRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';

class ArticleService {
  getArticles(query: { offset: string; limit: string; order: string; search: string }) {
    const { offset, limit, order, search } = query;

    const orderBy = order === 'oldest' ? { createdAt: 'asc' } : { createdAt: 'desc' };

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    return articleRepository.findMany(where, orderBy, parseInt(offset), parseInt(limit));
  }

  async updateArticle(id: number, data: any, userId: number) {
    const article = await articleRepository.findById(id);
    if (!article) throw new NotFoundError('게시글이 존재하지 않습니다.');
    if (article.userId !== userId) {
      throw new ForbiddenError('본인만 접근할 수 있습니다.');
    }
    return articleRepository.update(id, data);
  }

  async deleteArticle(id: number, userId: number) {
    const article = await articleRepository.findById(id);
    if (!article) throw new NotFoundError('게시글이 존재하지 않습니다.');
    if (article.userId !== userId) {
      throw new ForbiddenError('본인만 접근할 수 있습니다.');
    }
    return articleRepository.delete(id);
  }

  createArticle(data: any) {
    return articleRepository.create(data);
  }

  async getArticleById(id: number) {
    const article = await articleRepository.findById(id);
    if (!article) throw new NotFoundError('해당 게시글이 없습니다.');
    return article;
  }

  createComment(articleId: number, content: string) {
    return articleRepository.createComment(articleId, content);
  }

  async getComments(articleId: number, cursor?: number, limit = '10') {
    const comments = await articleRepository.findComments(articleId, cursor, parseInt(limit));

    return {
      data: comments,
      nextCursor: comments.length > 0 ? comments[comments.length - 1].id : null,
    };
  }
}

export default new ArticleService();
