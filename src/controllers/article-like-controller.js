// TODO) Article-Like-Controller: 요청 처리
// &) Service Import
import { articleLikeService } from '../services/article-like-service.js';

export const articleLikeController = {
  // ?) 게시글 좋아요 등록
  async like(req, res) {
    const result = await articleLikeService.like(req.user.id, req.params.id);

    res.status(201).json({
      success: true,
      message: '게시글 좋아요 완료',
      data: result,
    });
  },

  // ?) 게시글 좋아요 취소
  async unlike(req, res) {
    const result = await articleLikeService.unlike(req.user.id, req.params.id);

    res.status(200).json({
      success: true,
      message: '게시글 좋아요 취소 완료',
      data: result,
    });
  },

  // ?) 좋아요한 게시글 조회
  async list(req, res) {
    const liked = await articleLikeService.list(req.user.id);

    res.status(200).json({
      success: true,
      message: '좋아요한 게시글 목록 조회 성공',
      data: liked.map((item) => item.article),
    });
  },
};
