// TODO) Article-Comment-Service: 비즈니스 로직
// &) Core Import
import { NotFoundError, ValidationError } from '../core/error/error-handler.js';

// &) Util Import
import { toIntOrThrow } from '../utils/to-int.js';
import { assertContent } from '../utils/to-content.js';

// &) Repo Import
import { articleCommentRepo } from '../repositories/article-comment-repository.js';
import { articleRepo } from '../repositories/article-repository.js';

export const articleCommentService = {
  // ?) 댓글 목록 조회
  async list(articleId) {
    const aid = toIntOrThrow(articleId, 'articleId');
    const article = await articleRepo.findArticleById(aid);

    if (!article) {
      throw new NotFoundError('게시글을 찾을 수 없습니다');
    }

    return articleCommentRepo.findByArticle(aid);
  },

  // ?) 댓글 생성
  async create({ articleId, content }, userId) {
    const aid = toIntOrThrow(articleId, 'articleId');
    const body = assertContent(content);
    const article = await articleRepo.findArticleById(aid);

    if (!article) {
      throw new NotFoundError('게시글을 찾을 수 없습니다');
    }

    return articleCommentRepo.create({
      articleId: aid,
      content: body,
      userId,
    });
  },

  // ?) 댓글 수정
  async update(id, content, userId) {
    const cid = toIntOrThrow(id, 'id');
    const body = assertContent(content);
    const exists = await articleCommentRepo.findById(cid);

    if (!exists) {
      throw new NotFoundError('댓글을 찾을 수 없습니다');
    }

    if (exists.userId !== userId) {
      throw new ValidationError('userId', '댓글 수정 권한이 없습니다.');
    }

    return articleCommentRepo.update(cid, { content: body });
  },

  // ?) 댓글 삭제
  async remove(id, userId) {
    const cid = toIntOrThrow(id, 'id');
    const exists = await articleCommentRepo.findById(cid);

    if (!exists) {
      throw new NotFoundError('댓글을 찾을 수 없습니다');
    }

    if (exists.userId !== userId) {
      throw new ValidationError('userId', '댓글 삭제 권한이 없습니다.');
    }

    return articleCommentRepo.remove(cid);
  },
};
