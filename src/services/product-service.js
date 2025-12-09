// TODO) Product-Service: 비즈니스 로직
// &) Core Import
import { NotFoundError, ValidationError } from '../core/error/error-handler.js';

// &) Util Import
import { toIntOrThrow } from '../utils/to-int.js';

// &) Constant Import
import {
  PRODUCT_ORDER_MAP,
  DEFAULT_PRODUCT_ORDER,
} from '../constants/product.js';

// &) Repo Import
import { productRepo } from '../repositories/product-repository.js';
import { productLikeRepo } from '../repositories/product-like-repository.js';

export const productService = {
  // ?) 상품 목록 조회
  async list(query) {
    const { offset = 0, limit = 10, order = 'recent', q, tag } = query;
    const skip = toIntOrThrow(offset, 'offset');
    const take = toIntOrThrow(limit, 'limit');
    const orderKey = String(order || DEFAULT_PRODUCT_ORDER).toLowerCase();
    const orderBy = PRODUCT_ORDER_MAP[orderKey];

    if (!orderBy) {
      throw new ValidationError(
        'order',
        `order는 ${Object.keys(PRODUCT_ORDER_MAP).join(
          ', '
        )} 중 하나여야 합니다.`
      );
    }

    const where = {
      ...(q && {
        OR: [
          { name: { contains: String(q), mode: 'insensitive' } },
          { description: { contains: String(q), mode: 'insensitive' } },
        ],
      }),
      ...(tag && { tags: String(tag) }),
    };

    return productRepo.findProducts(where, orderBy, skip, take);
  },

  // ?) 상품 조회
  async getOrThrow(id) {
    const productId = toIntOrThrow(id, 'id');
    const product = await productRepo.findProductById(productId);

    if (!product) {
      throw new NotFoundError('상품을 찾을 수 없습니다');
    }

    return product;
  },

  // ?) 상품 생성
  async create(data, userId) {
    return await productRepo.createProduct({ ...data, userId });
  },

  // ?) 상품 수정
  async update(id, data, userId) {
    const productId = toIntOrThrow(id, 'id');
    const product = await productRepo.findProductById(productId);

    if (!product) throw new NotFoundError('상품을 찾을 수 없습니다');
    if (product.userId !== userId) {
      throw new ValidationError('userId', '상품 수정 권한이 없습니다.');
    }

    return productRepo.updateProduct(productId, data);
  },

  // ?) 상품 삭제
  async remove(id, userId) {
    const productId = toIntOrThrow(id, 'id');
    const product = await productRepo.findProductById(productId);

    if (!product) throw new NotFoundError('상품을 찾을 수 없습니다');
    if (product.userId !== userId) {
      throw new ValidationError('userId', '상품 삭제 권한이 없습니다.');
    }

    return productRepo.deleteProduct(productId);
  },

  // ?) 상품 구매
  async purchase(productId, quantity) {
    const pid = toIntOrThrow(productId, 'productId');
    const qty = toIntOrThrow(quantity, 'quantity');
    const product = await productRepo.findProductById(pid);

    if (!product) {
      throw new NotFoundError('상품을 찾을 수 없습니다');
    }
    if (qty > product.stock) {
      throw new ValidationError('quantity', '재고가 충분하지 않습니다.');
    }

    return productRepo.purchaseProductTx(product.id, qty, product.price);
  },

  // ?) 좋아요 여부 확인
  async isLiked(userId, productId) {
    const like = await productLikeRepo.findProductLike(userId, productId);
    return Boolean(like);
  },

  // ?) 유저별 상품 목록 조회
  async listByUser(userId) {
    return await productRepo.findProductsByUser(userId);
  },
};
