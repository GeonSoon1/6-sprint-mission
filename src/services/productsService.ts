import { prisma } from '../utils/prisma';

async function createProductInDb(productData, userId) {
  return prisma.product.create({
    data: {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      tags: productData.tags,
      userId,
    },
  });
}

async function findProducts({ sort, search, offset, limit }, userId) {
  const orderBy = sort === 'resent' ? { createdAt: 'desc' } : { createdAt: 'asc' };

  const where = {};
  if (search) {
    where.OR = [{ name: { contains: search } }, { description: { contains: search } }];
  }

  const selectOption = {
    id: true,
    name: true,
    price: true,
    createdAt: true,
  };

  if (userId) {
    selectOption.likes = {
      where: { userId },
      select: { id: true },
    };
  }

  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
      select: selectOption,
    }),
    prisma.product.count({ where }),
  ]);

  const productsLike = products.map((p) => {
    const isLiked = p.likes ? p.likes.length > 0 : false;
    const { likes, ...rest } = p;

    return {
      ...rest,
      isLiked,
    };
  });
  return { products: productsLike, totalProducts };
}

async function findProductById(id, userId) {
  const selectOption = {
    id: true,
    name: true,
    description: true,
    price: true,
    tags: true,
    createdAt: true,
    user: {
      select: {
        id: true,
        nickname: true,
        email: true,
      },
    },
  };

  if (userId) {
    selectOption.likes = {
      where: { userId },
      select: { id: true },
    };
  }

  const product = await prisma.product.findUniqueOrThrow({
    where: { id },
    select: selectOption,
  });

  const isLiked = product.likes ? product.likes.length > 0 : false;
  const { likes, ...rest } = product;

  return { ...rest, isLiked };
}

async function updateProductInDb(id, updateData, userId) {
  const product = await prisma.product.findUniqueOrThrow({ where: { id } });

  if (product.userId !== userId) {
    const error = new Error('수정 권한이 없습니다.');
    error.status = 403;
    throw error;
  }

  return prisma.product.update({
    where: { id },
    data: updateData,
  });
}

async function deleteProductInDb(id, userId) {
  const product = await prisma.product.findUniqueOrThrow({ where: { id } });

  if (product.userId !== userId) {
    const error = new Error('삭제 권한이 없습니다.');
    error.status = 403;
    throw error;
  }

  return prisma.product.delete({
    where: { id },
  });
}

export const productsService = {
  createProductInDb,
  findProducts,
  findProductById,
  updateProductInDb,
  deleteProductInDb,
};
