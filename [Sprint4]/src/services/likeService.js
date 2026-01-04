import prisma from '../lib/prisma.js';
import { ProductRepository } from '../repositories/productRepository.js';
import { ArticleRepository } from '../repositories/articleRepository.js';
import * as likeRepository from '../repositories/likeRepository.js';
// import * as productRepository from '../repositories/productRepository.js';
// import * as articleRepository from '../repositories/articleRepository.js';
// import { AppError } from '../lib/AppError.js';

const productRepository = new ProductRepository(prisma);
const articleRepository = new ArticleRepository(prisma);

/**
 * 상품 '좋아요' 상태를 토글(추가/삭제) 합니다.
 * @param {string} userId
 * @param {string} productId
 * @returns {Promise<{liked: boolean, likeCount: number}}
 */
export const toggleProductLike = async (userId, productId) => {
  // 1. 상품 존재 여부 확인
  const product = await productRepository.findProductById(productId);
  if (!product) {
    // AppError가 없다면 throw new Error('해당 상품을 찾을 수 없습니다.'); 로 수정
    throw new Error('해당 상품을 찾을 수 없습니다.');
  }

  // 2. 이미 '좋아요'를 눌렀는지 확인
  const existingLike = await likeRepository.findProductLike(userId, productId);
  let liked;
  let likeCount;

  if (existingLike) {
    // 3. '좋아요'가 있으면 삭제(unlike)
    likeCount = await likeRepository.deleteProductLike(userId, productId);
    liked = false;
  } else {
    // 4. '좋아요'가 없으면 추가(like)
    likeCount = await likeRepository.createProductLike(userId, productId);
    liked = true;
  }

  return { liked, likeCount };
};

/**
 * 게시글 '좋아요' 상태를 토글(추가/삭제)합니다.
 * @param {string} userId
 * @param {string} articleId
 * @returns  {Promise<{liked: boolean, likeCount: number}}
 */
export const toggleArticleLike = async (userId, articleId) => {
  // 1. 게시글 존재 여부 확인
  const article = await articleRepository.findArticleById(articleId);
  if (!article) {
    // AppError가 없다면 throw new Error('해당 게시글을 찾을 수 없습니다.')로 수정
    throw new Error('해당 게시글을 찾을 수 없습니다.');
  }

  // 2. '좋아요'를 눌렀는지 확인
  const existingLike = await likeRepository.findArticleLike(userId, articleId);
  let liked;
  let likeCount;

  if (existingLike) {
    // 3. '좋아요'가 있으면 삭제(unlike)
    likeCount = await likeRepository.deleteArticleLike(userId, articleId);
    liked = false;
  } else {
    // 4. '좋아요'가 없으면 추가(like)
    likeCount = await likeRepository.createArticleLike(userId, articleId);
    liked = true;
  }

  return { liked, likeCount };
};
