// TODO) Article-Comment-Service: 비즈니스 로직
import { NotFoundError, ForbiddenError } from '../core/error/error-handler.js';
import { toIntOrThrow } from '../utils/to-int.js';
import { assertContent } from '../utils/to-content.js';

import { articleCommentRepo } from '../repositories/article-comment-repository.js';
import { articleRepo } from '../repositories/article-repository.js';

export const articleCommentService = {
  // 1) 댓글 목록 조회
  async list(articleId: unknown) {
    // 1-1) 타입 number 변환
    const aid = toIntOrThrow(articleId, 'articleId');

    // 1-2) 댓글 대상 게시글 조회
    const article = await articleRepo.findArticleById(aid);

    // 1-3) 게시글 검증
    if (!article) {
      throw new NotFoundError('게시글을 찾을 수 없습니다');
    }

    return articleCommentRepo.findByArticle(aid);
  },

  // 2) 댓글 생성
  async create(
    { articleId, content }: { articleId: unknown; content: unknown },
    userId: number
  ) {
    // 2-1) 타입 number 변환
    const aid = toIntOrThrow(articleId, 'articleId');

    // 2-2) 타입 string 변환
    const body = assertContent(content);

    // 2-3) 댓글 대상 게시글 조회
    const article = await articleRepo.findArticleById(aid);

    // 2-4) 게시글 검증
    if (!article) {
      throw new NotFoundError('게시글을 찾을 수 없습니다');
    }

    return articleCommentRepo.create({
      articleId: aid,
      content: body,
      userId,
    });
  },

  // 3) 댓글 수정
  async update(id: unknown, content: unknown, userId: number) {
    // 3-1) 타입 number 변환
    const cid = toIntOrThrow(id, 'id');

    // 3-2) 타입 string 변환
    const body = assertContent(content);

    // 3-3) 기존 댓글 조회
    const exists = await articleCommentRepo.findById(cid);

    // 3-4) 댓글 검증
    if (!exists) {
      throw new NotFoundError('댓글을 찾을 수 없습니다');
    }

    // 3-5) 권한 검증
    if (exists.userId !== userId) {
      throw new ForbiddenError('댓글 수정 권한이 없습니다.');
    }

    return articleCommentRepo.update(cid, { content: body });
  },

  // 4) 댓글 삭제
  async remove(id: unknown, userId: number) {
    // 4-1) 타입 number 변환
    const cid = toIntOrThrow(id, 'id');

    // 4-2) 기존 댓글 조회
    const exists = await articleCommentRepo.findById(cid);

    // 4-3) 댓글 검증
    if (!exists) {
      throw new NotFoundError('댓글을 찾을 수 없습니다');
    }

    // 4-4) 권한 검증
    if (exists.userId !== userId) {
      throw new ForbiddenError('댓글 삭제 권한이 없습니다.');
    }

    return articleCommentRepo.remove(cid);
  },
};
