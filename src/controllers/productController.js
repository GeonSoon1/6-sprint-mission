import prisma from '../lib/prismaClient';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants';
import { verifyAccessToken } from '../lib/token';

// 내부에서 쓸 유저 id 추출
function getOptionalUserId(req) {
  try {
    const token = req.cookies?.[ACCESS_TOKEN_COOKIE_NAME];
    if (!token) return null;
    const decoded = verifyAccessToken(token); // { id: ... }
    return decoded.id;
  } catch {
    return null;
  }
}

export const getProducts = async (req, res) => {
  const userId = getOptionalUserId(req);

  const products = await prisma.product.findMany({
    include: {
      likes: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const mapped = products.map((p) => {
    const likeCount = p.likes.length;
    const isLiked = userId
      ? p.likes.some((like) => like.userId === userId)
      : false;

    const { likes, ...rest } = p;
    return { ...rest, likeCount, isLiked };
  });

  return res.status(200).json(mapped);
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  const userId = getOptionalUserId(req);

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      likes: true,
    },
  });

  if (!product) {
    return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
  }

  const likeCount = product.likes.length;
  const isLiked = userId
    ? product.likes.some((like) => like.userId === userId)
    : false;

  const { likes, ...rest } = product;
  return res.status(200).json({ ...rest, likeCount, isLiked });
};

export const createProduct = async (req, res) => {
  const { name, description, price, tags } = req.body;
  const userId = req.user.id;

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      tags,
      userId,
    },
  });

  return res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const { id } = req.params; // UUID 문자열
  const { name, description, price, tags } = req.body;
  const userId = req.user.id; // authenticate 미들웨어에서 세팅됨

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
  }

  // 작성자 체크
  if (product.userId !== userId) {
    return res.status(403).json({ message: '상품을 수정할 권한이 없습니다.' });
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(tags !== undefined && { tags }),
    },
  });

  return res.status(200).json(updatedProduct);
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
  }

  // 작성자 체크
  if (product.userId !== userId) {
    return res.status(403).json({ message: '상품을 삭제할 권한이 없습니다.' });
  }

  await prisma.product.delete({
    where: { id },
  });

  return res.status(204).send();
};

export const getMyProducts = async (req, res) => {
  const userId = req.user.id;

  const products = await prisma.product.findMany({
    where: { userId }, // 내가 만든 상품만
    orderBy: { createdAt: 'desc' },
  });

  return res.status(200).json(products);
};

export const toggleProductLike = async (req, res) => {
  const { id } = req.params; // productId
  const userId = req.user.id; // authenticate에서 셋팅

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
  }

  const existing = await prisma.productLike.findFirst({
    where: { userId, productId: id },
  });

  if (existing) {
    await prisma.productLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.productLike.create({
      data: { userId, productId: id },
    });
  }

  const likeCount = await prisma.productLike.count({
    where: { productId: id },
  });

  return res.status(200).json({
    isLiked: !existing,
    likeCount,
  });
};

export const getLikedProducts = async (req, res) => {
  const userId = req.user.id;

  const likes = await prisma.productLike.findMany({
    where: { userId },
    include: {
      product: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const products = likes.map((like) => like.product);

  return res.status(200).json(products);
};
