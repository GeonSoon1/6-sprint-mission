// TODO) Article-Service: 비즈니스 로직
// &) Core Import
import { NotFoundError, ValidationError } from '../core/error/error-handler.js';

// &) Util Import
import { toIntOrThrow } from '../utils/to-int.js';

// &) Constant Import
import {
  ARTICLE_ORDER_MAP,
  DEFAULT_ARTICLE_ORDER,
} from '../constants/article.js';

// &) Repo Import
import { articleRepo } from '../repositories/article-repository.js';
import { articleLikeRepo } from '../repositories/article-like-repository.js';

export const articleService = {
  // ?) 게시글 목록 조회
  async list(query) {
    const { offset = 0, limit = 10, order = DEFAULT_ARTICLE_ORDER, q } = query;
    const skip = toIntOrThrow(offset, 'offset');
    const take = toIntOrThrow(limit, 'limit');
    const orderKey = String(order || DEFAULT_ARTICLE_ORDER).toLowerCase();
    const orderBy = ARTICLE_ORDER_MAP[orderKey];

    if (!orderBy) {
      throw new ValidationError(
        'order',
        `order는 ${Object.keys(ARTICLE_ORDER_MAP).join(
          ', '
        )} 중 하나여야 합니다.`
      );
    }

    const where = q
      ? {
          OR: [
            { title: { contains: String(q), mode: 'insensitive' } },
            { content: { contains: String(q), mode: 'insensitive' } },
          ],
        }
      : {};

    return articleRepo.findArticles(where, orderBy, skip, take);
  },

  // ?) 게시글 조회
  async getOrThrow(id) {
    const articleId = toIntOrThrow(id, 'id');
    const article = await articleRepo.findArticleById(articleId);

    if (!article) {
      throw new NotFoundError('게시글을 찾을 수 없습니다');
    }

    return article;
  },

  // ?) 게시글 생성
  async create(data, userId) {
    return await articleRepo.createArticle({ ...data, userId });
  },

  // ?) 게시글 수정
  async update(id, data, userId) {
    const articleId = toIntOrThrow(id, 'id');
    const article = await articleRepo.findArticleById(articleId);

    if (!article) throw new NotFoundError('게시글을 찾을 수 없습니다');

    if (article.userId !== userId) {
      throw new ValidationError('userId', '게시글 수정 권한이 없습니다.');
    }

    return articleRepo.updateArticle(articleId, data);
  },

  // ?) 게시글 삭제
  async remove(id, userId) {
    const articleId = toIntOrThrow(id, 'id');
    const article = await articleRepo.findArticleById(articleId);

    if (!article) throw new NotFoundError('게시글을 찾을 수 없습니다');

    if (article.userId !== userId) {
      throw new ValidationError('userId', '게시글 삭제 권한이 없습니다.');
    }

    return articleRepo.deleteArticle(articleId);
  },

  // ?) 좋아요 여부 확인
  async isLiked(userId, articleId) {
    const like = await articleLikeRepo.findArticleLike(userId, articleId);

    return Boolean(like);
  },
};
