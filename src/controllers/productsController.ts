import { Request, Response } from 'express';
import { create } from 'superstruct';
import { productService } from '../services/productService.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from '../structs/productsStruct.js';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';

export async function createProduct(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const data = create(req.body, CreateProductBodyStruct);
  const createdProduct = await productService.createProduct(req.user.id, data);
  res.status(201).send(createdProduct);
}

export async function getProduct(req: Request, res: Response): Promise<void> {
  const { id } = create(req.params, IdParamsStruct);
  const product = await productService.getProduct(id, req.user?.id);
  res.send(product);
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateProductBodyStruct);
  const updatedProduct = await productService.updateProduct(id, req.user.id, data);
  res.send(updatedProduct);
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = create(req.params, IdParamsStruct);
  await productService.deleteProduct(id, req.user.id);
  res.status(204).send();
}

export async function getProductList(req: Request, res: Response): Promise<void> {
  const query = create(req.query, GetProductListParamsStruct);
  const result = await productService.getProductList(query, req.user?.id);
  res.send(result);
}

export async function createComment(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id: productId } = create(req.params, IdParamsStruct);
  const data = create(req.body, CreateCommentBodyStruct);
  const createdComment = await productService.createComment(productId, req.user.id, data);
  res.status(201).send(createdComment);
}

export async function getCommentList(req: Request, res: Response): Promise<void> {
  const { id: productId } = create(req.params, IdParamsStruct);
  const query = create(req.query, GetCommentListParamsStruct);
  const result = await productService.getCommentList(productId, query);
  res.send(result);
}

export async function createFavorite(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id: productId } = create(req.params, IdParamsStruct);
  await productService.createFavorite(productId, req.user.id);
  res.status(201).send();
}

export async function deleteFavorite(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id: productId } = create(req.params, IdParamsStruct);
  await productService.deleteFavorite(productId, req.user.id);
  res.status(204).send();
}
