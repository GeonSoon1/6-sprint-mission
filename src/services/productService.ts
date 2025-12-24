import type { Product, ProductLike, ProductLike as Like } from '@prisma/client';
import { HttpError } from '../lib/httpError';

import {
  findProductsWithLikes,
  findProductByIdWithLikes,
  findProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  findMyProducts,
  findProductLike,
  deleteProductLike,
  createProductLike,
  countProductLikes,
  findLikedProducts,
} from '../repositories/productRepository';

import { verifyAccessToken } from '../lib/token';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants';

export type CreateProductDto = {
  name: string;
  description: string;
  price: number;
  tags: string;
};

export type UpdateProductDto = {
  name?: string;
  description?: string;
  price?: number;
  tags?: string;
};

export type CookieBag = Record<string, string> | undefined;

type ProductWithLikes = Product & { likes: ProductLike[] };

function getOptionalUserId(cookies: CookieBag): string | null {
  try {
    const token = cookies?.[ACCESS_TOKEN_COOKIE_NAME];
    if (!token) return null;

    const decoded = verifyAccessToken(token) as { id: string };
    return decoded.id || null;
  } catch {
    return null;
  }
}

function mapWithLike(product: ProductWithLikes, userId: string | null) {
  const likeCount = product.likes.length;
  const isLiked = userId
    ? product.likes.some((l) => l.userId === userId)
    : false;

  const { likes, ...rest } = product;
  return { ...rest, likeCount, isLiked };
}

export async function getProductsService(cookies: CookieBag) {
  const userId = getOptionalUserId(cookies);

  const products = (await findProductsWithLikes()) as ProductWithLikes[];
  return products.map((p) => mapWithLike(p, userId));
}

export async function getProductByIdService(id: string, cookies: CookieBag) {
  const userId = getOptionalUserId(cookies);

  const product = (await findProductByIdWithLikes(
    id
  )) as ProductWithLikes | null;
  if (!product) throw new HttpError(404, '상품을 찾을 수 없습니다.');

  return mapWithLike(product, userId);
}

export async function createProductService(
  data: CreateProductDto,
  userId: string
) {
  return createProduct({ ...data, userId });
}

export async function updateProductService(
  id: string,
  data: UpdateProductDto,
  userId: string
) {
  const product = await findProductById(id);
  if (!product) throw new HttpError(404, '상품을 찾을 수 없습니다.');

  if (product.userId !== userId) {
    throw new HttpError(403, '상품을 수정할 권한이 없습니다.');
  }

  return updateProduct(id, data);
}

export async function deleteProductService(id: string, userId: string) {
  const product = await findProductById(id);
  if (!product) throw new HttpError(404, '상품을 찾을 수 없습니다.');

  if (product.userId !== userId) {
    throw new HttpError(403, '상품을 삭제할 권한이 없습니다.');
  }

  await deleteProduct(id);
}

export async function getMyProductsService(userId: string) {
  return findMyProducts(userId);
}

export async function toggleProductLikeService(
  productId: string,
  userId: string
) {
  const product = await findProductById(productId);
  if (!product) throw new HttpError(404, '상품을 찾을 수 없습니다.');

  const existing = await findProductLike(userId, productId);

  if (existing) await deleteProductLike(existing.id);
  else await createProductLike(userId, productId);

  const likeCount = await countProductLikes(productId);
  return { isLiked: !existing, likeCount };
}

export async function getLikedProductsService(userId: string) {
  const likes = await findLikedProducts(userId);
  return likes.map((l) => l.product);
}
