import { productsService } from '../services/productsService';
import { RequestHandler } from 'express';
import { ErrorWithStatus } from '../utils/types';
import { Prisma } from '@prisma/client';

export const createProduct: RequestHandler = async (req, res) => {
  const productData: Prisma.ProductCreateInput = req.body;
  const userId = req.user!.id;

  const newProduct = await productsService.createProductInDb(productData, userId);

  res.status(201).json({
    message: '상품이 성공적으로 등록되었습니다.',
    data: newProduct,
  });
};

export const getProducts: RequestHandler = async (req, res) => {
  const { sort, search } = req.query;
  const { offset = 0, limit } = req.paginationParams!;
  const userId = req.user?.id;

  const { products, totalProducts } = await productsService.findProducts(
    {
      sort: sort as string,
      search: search as string,
      offset,
      limit,
    },
    userId,
  );

  if (search && totalProducts === 0) {
    res.status(200).json({
      message: `${search}와 일치하는 상품을 찾을 수 없습니다.`,
      data: [],
      pagination: {},
    });
    return;
  }

  const totalPages = Math.ceil(totalProducts / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  res.status(200).json({
    message: '상품 목록을 조회했습니다.',
    data: products,
    pagination: {
      totalItems: totalProducts,
      totalPages,
      currentPage,
      itemsPerPage: limit,
    },
  });
};

export const getProduct: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const product = await productsService.findProductById(id, userId);

  res.status(200).send(product);
};

export const patchProduct: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const { name, description, price, tags } = req.body;

  const updateData: Prisma.ProductUpdateInput = {
    name,
    description,
    price,
    tags,
  };

  const hasUpdateValues = Object.values(updateData).some((value) => value !== undefined);

  if (!hasUpdateValues) {
    const err: ErrorWithStatus = new Error('수정할 내용이 비어 있습니다.');
    err.status = 400;
    throw err;
  }

  const product = await productsService.updateProductInDb(id, updateData, userId);

  res.status(200).json({
    message: '상품이 성공적으로 수정되었습니다.',
    data: product,
  });
};

export const deleteProduct: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const deletedProduct = await productsService.deleteProductInDb(id, userId);

  res.status(200).json({
    message: '상품이 성공적으로 삭제되었습니다.',
    data: deletedProduct,
  });
};
