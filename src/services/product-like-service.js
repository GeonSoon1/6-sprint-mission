// TODO) Product-Like-Service: 상품 좋아요 비즈니스 로직
// &) Core Import
import { NotFoundError, ConflictError } from '../core/error/error-handler.js';

// &) Util Import
import { toIntOrThrow } from '../utils/to-int.js';

// &) Repo Import
import { productRepo } from '../repositories/product-repository.js';
import { productLikeRepo } from '../repositories/product-like-repository.js';

export const productLikeService = {
  // ?) 상품 좋아요 등록
  async like(userId, productId) {
    const pid = toIntOrThrow(productId, 'productId');
    const product = await productRepo.findProductById(pid);

    if (!product) {
      throw new NotFoundError('상품을 찾을 수 없습니다');
    }

    const existed = await productLikeRepo.findProductLike(userId, pid);
    if (existed) {
      throw new ConflictError('이미 좋아요한 상품입니다');
    }

    await productLikeRepo.createProductLike(userId, pid);
    return { productId: pid, liked: true };
  },

  // ?) 상품 좋아요 취소
  async unlike(userId, productId) {
    const pid = toIntOrThrow(productId, 'productId');
    const like = await productLikeRepo.findProductLike(userId, pid);

    if (!like) {
      throw new NotFoundError('좋아요가 존재하지 않습니다');
    }

    await productLikeRepo.deleteProductLike(userId, pid);
    return { productId: pid, liked: false };
  },

  // ?) 좋아요한 상품 조회
  async list(userId) {
    return await productLikeRepo.listLikedProducts(userId);
  },
};
