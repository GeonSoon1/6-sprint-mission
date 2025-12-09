import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient';
import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import UnauthorizeError from '../lib/errors/UnauthorizeError';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from '../structs/productsStruct';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct';
import { Request, Response } from 'express';

//기본 주요 기능
export async function createProduct(req: Request, res: Response) {
  const { name, description, price, tags, images } = create(req.body, CreateProductBodyStruct);
  const user = req.user;

  if (!user) {
    throw new UnauthorizeError();
  }

  const product = await prismaClient.product.create({
    data: { name, description, price, tags, images, authorId: user.id },
  });

  res.status(201).send({ message: 'product 생성됨', product });
}

export async function getProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const user = req.user;

  const product = await prismaClient.product.findUnique({ where: { id } });
  if (!product) {
    throw new NotFoundError('product', id);
  }

  if (!user) {
    throw new UnauthorizeError();
  }

  const isLiked = await prismaClient.likeProduct.findFirst({
    where: { userId: user.id, productId: id },
  });

  return res.send({ product: product, isLike: Boolean(isLiked) });
}

export async function updateProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const { name, description, price, tags, images } = create(req.body, UpdateProductBodyStruct);
  const user = req.user;

  const existingProduct = await prismaClient.product.findUnique({ where: { id } });
  if (!existingProduct) {
    throw new NotFoundError('product', id);
  }

  if (!user) {
    throw new UnauthorizeError();
  }
  if (existingProduct.authorId !== user.id) {
    throw new ForbiddenError('product');
  }

  const updatedProduct = await prismaClient.product.update({
    where: { id },
    data: { name, description, price, tags, images },
  });

  return res.send({ message: 'product 수정됨', updatedProduct });
}

export async function deleteProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const user = req.user;
  const existingProduct = await prismaClient.product.findUnique({ where: { id } });

  if (!existingProduct) {
    throw new NotFoundError('product', id);
  }

  if (!user) {
    throw new UnauthorizeError();
  }

  if (existingProduct.authorId !== user.id) {
    throw new ForbiddenError('product');
  }

  await prismaClient.product.delete({ where: { id } });

  return res.status(204).send({ message: 'product 삭제됨' });
}

export async function getProductList(req: Request, res: Response) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetProductListParamsStruct);

  const where = keyword
    ? {
        OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
      }
    : undefined;
  const totalCount = await prismaClient.product.count({ where });
  const products = await prismaClient.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
    where,
  });

  return res.send({
    list: products,
    totalCount,
  });
}

//댓글 기능
export async function createComment(req: Request, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);
  const user = req.user;

  const existingProduct = await prismaClient.product.findUnique({ where: { id: productId } });
  if (!existingProduct) {
    throw new NotFoundError('product', productId);
  }

  if (!user) {
    throw new UnauthorizeError();
  }

  if (existingProduct.authorId !== user.id) {
    throw new ForbiddenError('product');
  }

  const comment = await prismaClient.comment.create({
    data: { productId, content, authorId: user.id },
  });

  return res.status(201).send(comment);
}

export async function getCommentList(req: Request, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const existingProduct = await prismaClient.product.findUnique({ where: { id: productId } });
  if (!existingProduct) {
    throw new NotFoundError('product', productId);
  }

  const commentsWithCursorComment = await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { productId },
  });
  const comments = commentsWithCursorComment.slice(0, limit);
  const cursorComment = commentsWithCursorComment[comments.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  return res.send({
    list: comments,
    nextCursor,
  });
}

//좋아요 기능

export async function likeProduct(req: Request, res: Response) {
  try {
    const { id } = create(req.params, IdParamsStruct);

    if (!req.user) {
      throw new UnauthorizeError();
    }
    const userId = req.user.id;

    const like = await prismaClient.likeProduct.create({ data: { userId, productId: id } });
    res.status(200).send({ message: 'Like!', like });
  } catch (err) {
    return res.status(400).send('already liked Product!');
  }
}

export async function dislikeProduct(req: Request, res: Response) {
  try {
    const { id } = create(req.params, IdParamsStruct);

    if (!req.user) {
      throw new UnauthorizeError();
    }
    const userId = req.user.id;

    const likeProductFind = await prismaClient.likeProduct.findFirst({
      where: { productId: id, userId: userId },
    });

    if (!likeProductFind) {
      throw new NotFoundError('no liked Product', likeProductFind!.id);
    }

    const dislikeProduct = await prismaClient.likeProduct.delete({
      where: { id: likeProductFind.id },
    });

    res.status(200).send({ message: 'Dislike!', dislikeProduct });
  } catch (err) {
    return res.status(400).send('already disliked Product');
  }
}
