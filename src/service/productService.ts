import { User } from '@prisma/client';
import { CreateProductBodyDTO, GetListProductParam, UpdateProductDto } from '../dto/product.dto';
import BadRequestError from '../lib/errors/BadRequestError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import NotFoundError from '../lib/errors/NotFoundError';
import UnauthorizeError from '../lib/errors/UnauthorizeError';
import { productRepository } from '../repository/productRepository';

export const productService = {
  async createProduct(data: CreateProductBodyDTO, user: User | null | undefined) {
    if (!user) {
      throw new UnauthorizeError();
    }
    return productRepository.create({
      ...data,
      authorId: user.id,
    });
  },

  async getProduct(id: number, user: User | null | undefined) {
    if (!user) {
      throw new UnauthorizeError();
    }
    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('product', id);
    }

    return { id: product };
  },

  async updateProduct(id: number, data: UpdateProductDto, user: User | null | undefined) {
    if (!user) {
      throw new UnauthorizeError();
    }
    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('product', id);
    }
    if (product.authorId !== user.id) {
      throw new ForbiddenError('product');
    }

    return productRepository.update(id, data);
  },

  async deleteProduct(id: number, user: User | null | undefined) {
    if (!user) {
      throw new UnauthorizeError();
    }
    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('product', id);
    }
    if (product.authorId !== user.id) {
      throw new ForbiddenError('product');
    }

    return productRepository.delete(id);
    ``;
  },

  async getListProduct(params: GetListProductParam) {
    const { page, pageSize, orderBy, keyword } = params;

    const where = keyword
      ? {
          OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
        }
      : undefined;

    const list = productRepository.findList({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
      where,
    });

    return { list: list };
  },

  async likeProduct(id: number, user: User | null | undefined) {
    if (!user) {
      throw new UnauthorizeError();
    }

    const isLike = await productRepository.isLiked(user.id, id);
    if (isLike) {
      new BadRequestError('Already like product!');
    }

    return productRepository.likeProduct(user.id, id);
  },

  async dislikeProduct(id: number, user: User | null | undefined) {
    if (!user) {
      throw new UnauthorizeError();
    }

    const likeProductFind = await productRepository.isLiked(user.id, id);

    if (likeProductFind) {
      new BadRequestError('Already dislike product!');
    }
    return productRepository.dislikeProduct(user.id);
  },
};
