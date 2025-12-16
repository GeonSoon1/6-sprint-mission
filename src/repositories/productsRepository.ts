import { prisma } from '../utils/prisma';
import { Prisma } from '@prisma/client';

const createProduct = async (data: Prisma.ProductCreateInput) => {
  return prisma.product.create({ data });
};

const findProducts = async (params: Prisma.ProductFindManyArgs) => {
  return prisma.product.findMany(params);
};

const countProducts = async (where: Prisma.ProductWhereInput) => {
  return prisma.product.count({ where });
};

const findProductById = async (id: string, select?: Prisma.ProductSelect) => {
  return prisma.product.findUniqueOrThrow({
    where: { id },
    select,
  });
};

const updateProduct = async (id: string, data: Prisma.ProductUpdateInput) => {
  return prisma.product.update({
    where: { id },
    data,
  });
};

const deleteProduct = async (id: string) => {
  return prisma.product.delete({
    where: { id },
  });
};

export const productsRepository = {
  createProduct,
  findProducts,
  countProducts,
  findProductById,
  updateProduct,
  deleteProduct,
};
