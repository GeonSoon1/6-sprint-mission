import {
  toggleProductLike,
  toggleArticleLike,
} from '../services/likeService.js';
import { asyncHandler } from '../lib/asyncHandler.js';

const handleToggleProductLike = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  const result = await toggleProductLike(userId, productId);
  const message = result.liked
    ? '상품에 좋아요를 추가했습니다.'
    : '상품 좋아요를 취소했습니다.';

  res.status(200).json({
    message,
    data: result,
  });
});

const handleToggleArticleLike = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { articleId } = req.params;

  const result = await toggleArticleLike(userId, articleId);

  const message = result.liked
    ? '게시글에 좋아요를 추가했습니다.'
    : '게시글 좋아요를 취소했습니다.';

  res.status(200).json({
    message,
    data: result,
  });
});

export const likeController = {
  handleToggleProductLike,
  handleToggleArticleLike,
};
