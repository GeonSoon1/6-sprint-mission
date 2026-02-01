import NotFoundError from "../errors/NotFoundError.js";
import { prisma } from "../lib/prisma.js";
import * as productLikeRepo from "../repositories/productLike.repo.js";
import * as articleLikeRepo from "../repositories/articleLike.repo.js";

// 상품 좋아요
export async function likeProduct(productId, userId) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new NotFoundError("상품을 찾을 수 없습니다.");

  const existing = await productLikeRepo.findProductLike(userId, productId);
  if (existing) return;

  await productLikeRepo.createProductLike(userId, productId);
}

// 상품 좋아요 취소
export async function unlikeProduct(productId, userId) {
  const existing = await productLikeRepo.findProductLike(userId, productId);
  if (!existing) return;

  await productLikeRepo.deleteProductLike(userId, productId);
}

// 게시글 좋아요
export async function likeArticle(articleId, userId) {
  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) throw new NotFoundError("게시글을 찾을 수 없습니다.");

  const existing = await articleLikeRepo.findArticleLike(userId, articleId);
  if (existing) return;

  await articleLikeRepo.createArticleLike(userId, articleId);
}

// 게시글 좋아요 취소
export async function unlikeArticle(articleId, userId) {
  const existing = await articleLikeRepo.findArticleLike(userId, articleId);
  if (!existing) return;

  await articleLikeRepo.deleteArticleLike(userId, articleId);
}

// 내가 좋아요한 상품 목록
export async function getMyLikedProducts(userId) {
  const rows = await productLikeRepo.findLikedProductsByUser(userId);
  return rows.map((r) => ({
    ...r.product,
    isLiked: true,
    likedAt: r.createdAt,
  }));
}

export async function getMyLikedArticles(userId) {
  const rows = await articleLikeRepo.findLikedArticlesByUser(userId);

  return rows.map((r) => ({
    ...r.article,
    isLiked: true,
    likedAt: r.createdAt,
  }));
}