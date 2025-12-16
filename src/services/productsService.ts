import { productsRepository } from '../repositories/productsRepository';
import { Prisma } from '@prisma/client';
import { ErrorWithStatus } from '../utils/types';

interface FindProductsQuery {
  search?: string;
  limit?: number;
  offset?: number;
  sort?: string;
}

const createProductInDb = async (productData: Prisma.ProductCreateInput, userId: string) => {
  return productsRepository.createProduct({
    ...productData,
    user: {
      connect: { id: userId },
    },
  });
};

const findProducts = async (
  { sort, search, offset, limit }: FindProductsQuery,
  userId: string | undefined,
) => {
  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === 'recent' ? { createdAt: 'desc' } : { createdAt: 'asc' };

  const where: Prisma.ProductWhereInput = {};
  if (search) {
    where.OR = [{ name: { contains: search } }, { description: { contains: search } }];
  }

  const selectOption: Prisma.ProductSelect = {
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
    productsRepository.findProducts({
      where,
      orderBy,
      skip: offset,
      take: limit,
      select: selectOption,
    }),
    productsRepository.countProducts(where),
  ]);

  const productsLike = products.map((p) => {
    const product = p as any;
    const isLiked = product.likes ? product.likes.length > 0 : false;
    const { likes, ...rest } = product;

    return {
      ...rest,
      isLiked,
    };
  });

  return { products: productsLike, totalProducts };
};

const findProductById = async (id: string, userId: string | undefined) => {
  const selectOption: Prisma.ProductSelect = {
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

  const product = await productsRepository.findProductById(id, selectOption);

  const productData = product as any;
  const isLiked = productData.likes ? productData.likes.length > 0 : false;
  const { likes, ...rest } = productData;

  return { ...rest, isLiked };
};

const updateProductInDb = async (
  id: string,
  updateData: Prisma.ProductUpdateInput,
  userId: string,
) => {
  const product = await productsRepository.findProductById(id, { userId: true });

  if (product.userId !== userId) {
    const error: ErrorWithStatus = new Error('수정 권한이 없습니다.');
    error.status = 403;
    throw error;
  }

  return productsRepository.updateProduct(id, updateData);
};

const deleteProductInDb = async (id: string, userId: string) => {
  const product = await productsRepository.findProductById(id, { userId: true });

  if (product.userId !== userId) {
    const error: ErrorWithStatus = new Error('삭제 권한이 없습니다.');
    error.status = 403;
    throw error;
  }

  return productsRepository.deleteProduct(id);
};

export const productsService = {
  createProductInDb,
  findProducts,
  findProductById,
  updateProductInDb,
  deleteProductInDb,
};
