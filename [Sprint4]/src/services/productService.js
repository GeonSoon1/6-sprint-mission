import prisma from '../lib/prisma.js';
import { ProductRepository } from '../repositories/productRepository.js';
import { getTags, getImages } from '../lib/prismaUtil.js';

const productRepository = new ProductRepository(prisma);

export const productService = {
  // 생성하기
  create: async (productCreateData) => {
    const { tags, images, files, ...rest } = productCreateData;

    return prisma.$transaction(async (tx) => {
      const productData = {
        ...rest,
        tags: getTags(tags),
        images: getImages(files),
      };
      const newProduct = await productRepository.createProduct(productData, tx);
      return newProduct;
    });
  },

  // 수정하기
  update: async (id, productUpdateData) => {
    const { tags, images, files, ...rest } = productUpdateData;

    return prisma.$transaction(async (tx) => {
      const productData = {
        ...rest,
        tags: getTags(tags),
        images: getImages(files),
      };
      const updateProduct = await productRepository.patchProduct(
        id,
        productData,
        tx,
      );
      return updateProduct;
    });
  },

  // 삭제하기
  delete: async (id) => {
    return productRepository.deleteProduct(id);
  },

  // ID로 찾기
  findById: async (id) => {
    return productRepository.findProductById(id);
  },
  // 찾기
  find: async ({
    sort,
    category,
    status,
    keyword,
    limit = 10,
    offset = 0,
    authorId,
  }) => {
    // const  = req.query;
    // const limit = parseInt(req.query.limit || 10, 10);
    // const offset = parseInt(req.query.offset || 10, 10);
    const select = {
      id: true,
      name: true,
      price: true,
      createdAt: true,
      status: true,
      category: true,
    };

    const sortOptions = {
      newest: { createdAt: 'desc' },
      oldest: { createdAt: 'asc' },
      priceHighest: { price: 'desc' },
      priceLowest: { price: 'asc' },
    };

    const where = {
      ...(category && { category }),
      ...(status && { status }),
      ...(keyword && {
        OR: [
          { name: { contains: keyword } },
          { description: { contains: keyword } },
          { authorId },
        ],
      }),
    };

    const findOptions = {
      where,
      select,
      take: limit,
      skip: offset,
      orderBy: sortOptions[sort] || sortOptions.newest,
    };
    return productRepository.findProducts(findOptions);
  },
};
