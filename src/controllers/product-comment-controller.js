// TODO) Product-Comment-Controller: 요청 처리
// &) Service Import
import { productCommentService } from '../services/product-comment-service.js';

export const productCommentController = {
  // ?) 댓글 목록 조회
  async list(req, res) {
    const comments = await productCommentService.list(req.params.productId);

    res.status(200).json({
      success: true,
      message: '상품 댓글 목록 조회 성공',
      data: comments,
    });
  },

  // ?) 댓글 생성
  async create(req, res) {
    const comment = await productCommentService.create(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: '상품 댓글이 등록되었습니다',
      data: comment,
    });
  },

  // ?) 댓글 수정
  async update(req, res) {
    const comment = await productCommentService.update(
      req.params.id,
      req.body.content,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: '상품 댓글이 수정되었습니다',
      data: comment,
    });
  },

  // ?) 댓글 삭제
  async remove(req, res) {
    await productCommentService.remove(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: '상품 댓글이 삭제되었습니다',
    });
  },
};
