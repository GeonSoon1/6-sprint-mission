// TODO) Product-Comment-Service: 비즈니스 로직
// &) Core Import
import { NotFoundError, ValidationError } from '../core/error/error-handler.js';

// &) Util Import
import { toIntOrThrow } from '../utils/to-int.js';
import { assertContent } from '../utils/to-content.js';

// &) Repo Import
import { productCommentRepo } from '../repositories/product-comment-repository.js';
import { productRepo } from '../repositories/product-repository.js';

export const productCommentService = {
  // ?) 댓글 목록 조회
  async list(productId) {
    const pid = toIntOrThrow(productId, 'productId');
    const product = await productRepo.findProductById(pid);

    if (!product) {
      throw new NotFoundError('상품을 찾을 수 없습니다');
    }

    return productCommentRepo.findCommentsByProduct(pid);
  },

  // ?) 댓글 생성
  async create({ productId, content }, userId) {
    const pid = toIntOrThrow(productId, 'productId');
    const body = assertContent(content);
    const product = await productRepo.findProductById(pid);

    if (!product) {
      throw new NotFoundError('상품을 찾을 수 없습니다');
    }

    return productCommentRepo.createProductComment({
      productId: pid,
      content: body,
      userId,
    });
  },

  // ?) 댓글 수정
  async update(id, content, userId) {
    const cid = toIntOrThrow(id, 'id');
    const body = assertContent(content);
    const exists = await productCommentRepo.findProductCommentById(cid);

    if (!exists) {
      throw new NotFoundError('댓글을 찾을 수 없습니다');
    }
    if (exists.userId !== userId) {
      throw new ValidationError('userId', '댓글 수정 권한이 없습니다.');
    }

    return productCommentRepo.updateProductComment(cid, {
      content: body,
    });
  },

  // ?) 댓글 삭제
  async remove(id, userId) {
    const cid = toIntOrThrow(id, 'id');
    const exists = await productCommentRepo.findProductCommentById(cid);

    if (!exists) {
      throw new NotFoundError('댓글을 찾을 수 없습니다');
    }
    if (exists.userId !== userId) {
      throw new ValidationError('userId', '댓글 삭제 권한이 없습니다.');
    }

    return productCommentRepo.deleteProductComment(cid);
  },
};
