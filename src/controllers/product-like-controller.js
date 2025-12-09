// TODO) Product-Like-Controller: 요청 처리
// &) Service Import
import { productLikeService } from '../services/product-like-service.js';

export const productLikeController = {
  // ?) 상품 좋아요 등록
  async like(req, res) {
    const result = await productLikeService.like(req.user.id, req.params.id);

    res.status(201).json({
      success: true,
      message: '상품 좋아요 완료',
      data: result,
    });
  },

  // ?) 상품 좋아요 취소
  async unlike(req, res) {
    const result = await productLikeService.unlike(req.user.id, req.params.id);

    res.status(200).json({
      success: true,
      message: '상품 좋아요 취소 완료',
      data: result,
    });
  },

  // ?) 좋아요한 상품 조회
  async list(req, res) {
    const liked = await productLikeService.list(req.user.id);

    res.status(200).json({
      success: true,
      message: '좋아요한 상품 목록 조회 성공',
      data: liked.map((item) => item.product),
    });
  },
};
