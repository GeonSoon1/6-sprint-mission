// TODO) Article-Comment-Controller: 요청 처리
// &) service Import
import { articleCommentService } from '../services/article-comment-service.js';

export const articleCommentController = {
  // ?) 댓글 목록 조회
  async list(req, res) {
    const comments = await articleCommentService.list(req.params.articleId);

    res.status(200).json({
      success: true,
      message: '게시글 댓글 목록 조회 성공',
      data: comments,
    });
  },

  // ?) 댓글 생성
  async create(req, res) {
    const comment = await articleCommentService.create(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: '게시글 댓글이 등록되었습니다',
      data: comment,
    });
  },

  // ?) 댓글 수정
  async update(req, res) {
    const comment = await articleCommentService.update(
      req.params.id,
      req.body.content,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: '게시글 댓글이 수정되었습니다',
      data: comment,
    });
  },

  // ?) 댓글 삭제
  async remove(req, res) {
    await articleCommentService.remove(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: '게시글 댓글이 삭제되었습니다',
    });
  },
};
