import likeRepository, { LikeTargetType } from '../repository/likeRepository';
import ValidationError from '../lib/errors/ValidationError';

class LikeService {
  async toggleLike(userId: number, targetId: number, baseUrl: string) {
    if (!targetId) {
      throw new ValidationError('유효하지 않은 targetId입니다.');
    }

    const type: LikeTargetType = baseUrl.includes('/products') ? 'Product' : 'Article';

    const existing = await likeRepository.findExistingLike(type, userId, targetId);

    const isLiked = await likeRepository.toggleLikeTransaction(
      type,
      userId,
      targetId,
      existing?.id,
    );

    return {
      isLiked,
      message: isLiked ? '좋아요 등록됨' : '좋아요 해제됨',
    };
  }
}

export default new LikeService();
