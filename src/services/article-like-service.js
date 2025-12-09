// TODO) Article-Like-Service: 게시글 좋아요 비즈니스 로직
// &) Core Import
import { NotFoundError, ConflictError } from '../core/error/error-handler.js';

// &) Util Import
import { toIntOrThrow } from '../utils/to-int.js';

// &) Repo Import
import { articleRepo } from '../repositories/article-repository.js';
import { articleLikeRepo } from '../repositories/article-like-repository.js';

export const articleLikeService = {
  // ?) 게시글 좋아요 등록
  async like(userId, articleId) {
    const aid = toIntOrThrow(articleId, 'articleId');
    const article = await articleRepo.findArticleById(aid);

    if (!article) {
      throw new NotFoundError('게시글을 찾을 수 없습니다');
    }

    const existed = await articleLikeRepo.findArticleLike(userId, aid);

    if (existed) {
      throw new ConflictError('이미 좋아요한 게시글입니다');
    }

    await articleLikeRepo.createArticleLike(userId, aid);
    return { articleId: aid, liked: true };
  },

  // ?) 게시글 좋아요 취소
  async unlike(userId, articleId) {
    const aid = toIntOrThrow(articleId, 'articleId');
    const like = await articleLikeRepo.findArticleLike(userId, aid);

    if (!like) {
      throw new NotFoundError('좋아요가 존재하지 않습니다');
    }

    await articleLikeRepo.deleteArticleLike(userId, aid);
    return { articleId: aid, liked: false };
  },

  // ?) 좋아요한 게시글 조회
  list(userId) {
    return articleLikeRepo.listLikedArticles(userId);
  },
};
