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

function getOptionalUserId(cookies: CookieBag): string | null {
  try {
    const token = cookies?.[ACCESS_TOKEN_COOKIE_NAME];
    if (!token) return null;
    const decoded = verifyAccessToken(token);
    const userId = String((decoded as any).id);
    return userId || null;
  } catch {
    return null;
  }
}

type LikeRow = { userId: string };
type ProductWithLikes = { likes: LikeRow[]; [key: string]: any };

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
  const products = await findProductsWithLikes();
  return products.map((p: any) => mapWithLike(p, userId));
}

export async function getProductByIdService(id: string, cookies: CookieBag) {
  const userId = getOptionalUserId(cookies);
  const product = await findProductByIdWithLikes(id);

  if (!product) {
    const e: any = new Error('상품을 찾을 수 없습니다.');
    e.status = 404;
    throw e;
  }

  return mapWithLike(product as any, userId);
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

  if (!product) {
    const e: any = new Error('상품을 찾을 수 없습니다.');
    e.status = 404;
    throw e;
  }

  if (product.userId !== userId) {
    const e: any = new Error('상품을 수정할 권한이 없습니다.');
    e.status = 403;
    throw e;
  }

  return updateProduct(id, data);
}

export async function deleteProductService(id: string, userId: string) {
  const product = await findProductById(id);

  if (!product) {
    const e: any = new Error('상품을 찾을 수 없습니다.');
    e.status = 404;
    throw e;
  }

  if (product.userId !== userId) {
    const e: any = new Error('상품을 삭제할 권한이 없습니다.');
    e.status = 403;
    throw e;
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

  if (!product) {
    const e: any = new Error('상품을 찾을 수 없습니다.');
    e.status = 404;
    throw e;
  }

  const existing = await findProductLike(userId, productId);

  if (existing) {
    await deleteProductLike(existing.id);
  } else {
    await createProductLike(userId, productId);
  }

  const likeCount = await countProductLikes(productId);

  return {
    isLiked: !existing,
    likeCount,
  };
}

export async function getLikedProductsService(userId: string) {
  const likes = await findLikedProducts(userId);
  return likes.map((l: any) => l.product);
}
