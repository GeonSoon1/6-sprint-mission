// TODO) Article-Like-Service: 게시글 좋아요 비즈니스 로직
import { NotFoundError, ConflictError } from '../core/error/error-handler.js';
import { toIntOrThrow } from '../utils/to-int.js';

import { articleRepo } from '../repositories/article-repository.js';
import { articleLikeRepo } from '../repositories/article-like-repository.js';

export const articleLikeService = {
  // 1) 게시글 좋아요 등록
  async like(userId: number, articleId: unknown) {
    // 1-1) 타입 number 변환
    const aid = toIntOrThrow(articleId, 'articleId');

    // 1-2) 좋아요 대상 게시글 조회
    const article = await articleRepo.findArticleById(aid);

    // 1-3) 게시글 검증
    if (!article) {
      throw new NotFoundError('게시글을 찾을 수 없습니다');
    }

    // 1-4) 기존 좋아요 여부 확인
    const existed = await articleLikeRepo.findArticleLike(userId, aid);

    // 1-5) 좋아요 검증
    if (existed) {
      throw new ConflictError('이미 좋아요한 게시글입니다');
    }

    await articleLikeRepo.createArticleLike(userId, aid);

    return { articleId: aid, liked: true };
  },

  // 2) 게시글 좋아요 취소
  async unlike(userId: number, articleId: unknown) {
    // 2-1) 타입 number 변환
    const aid = toIntOrThrow(articleId, 'articleId');

    // 2-2) 기존 좋아요 여부 조회
    const like = await articleLikeRepo.findArticleLike(userId, aid);

    // 2-3) 좋아요 검증
    if (!like) {
      throw new NotFoundError('좋아요가 존재하지 않습니다');
    }

    await articleLikeRepo.deleteArticleLike(userId, aid);

    return { articleId: aid, liked: false };
  },

  // 3) 좋아요한 게시글 조회
  list(userId: number) {
    return articleLikeRepo.listLikedArticles(userId);
  },
};
