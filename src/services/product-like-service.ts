// TODO) Product-Like-Service: 상품 좋아요 비즈니스 로직
import { NotFoundError, ConflictError } from '../core/error/error-handler.js';
import { toIntOrThrow } from '../utils/to-int.js';

import { productRepo } from '../repositories/product-repository.js';
import { productLikeRepo } from '../repositories/product-like-repository.js';

export const productLikeService = {
  // 1) 상품 좋아요 등록
  async like(userId: number, productId: unknown) {
    // 1-1) 타입 number 변환
    const pid = toIntOrThrow(productId, 'productId');

    // 1-2) 좋아요 대상 상품 조회
    const product = await productRepo.findProductById(pid);

    // 1-3) 상품 검증
    if (!product) {
      throw new NotFoundError('상품을 찾을 수 없습니다');
    }

    // 1-4) 기존 좋아요 여부 확인
    const existed = await productLikeRepo.findProductLike(userId, pid);

    // 1-5) 좋아요 검증
    if (existed) {
      throw new ConflictError('이미 좋아요한 상품입니다');
    }

    await productLikeRepo.createProductLike(userId, pid);

    return { productId: pid, liked: true };
  },

  // 2) 상품 좋아요 취소
  async unlike(userId: number, productId: unknown) {
    // 1-1) 타입 number 변환
    const pid = toIntOrThrow(productId, 'productId');

    // 2-2) 기존 좋아요 여부 조회
    const like = await productLikeRepo.findProductLike(userId, pid);

    // 2-3) 좋아요 검증
    if (!like) {
      throw new NotFoundError('좋아요가 존재하지 않습니다');
    }

    await productLikeRepo.deleteProductLike(userId, pid);

    return { productId: pid, liked: false };
  },

  // 3) 좋아요한 상품 조회
  async list(userId: number) {
    return await productLikeRepo.listLikedProducts(userId);
  },
};
