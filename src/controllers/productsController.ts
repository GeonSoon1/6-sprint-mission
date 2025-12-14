import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from '../structs/productsStruct';
import { Request, Response } from 'express';
import { productService } from '../service/productService';

//기본 주요 기능
export async function createProduct(req: Request, res: Response) {
  const data = create(req.body, CreateProductBodyStruct);
  const result = await productService.createProduct(data, req.user);

  return res.status(201).send({ message: 'product 생성됨', result });
}

export async function getProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const result = await productService.getProduct(id, req.user);

  return res.send(result);
}

export async function updateProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateProductBodyStruct);
  const result = await productService.updateProduct(id, data, req.user);

  return res.send({ message: 'product 수정됨', result });
}

export async function deleteProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const result = await productService.deleteProduct(id, req.user);

  return res.status(204).send({ message: 'product 삭제됨', product: result });
}

export async function getProductList(req: Request, res: Response) {
  const params = create(req.query, GetProductListParamsStruct);

  const result = await productService.getListProduct(params);

  return res.send(result);
}

//좋아요 기능

export async function likeProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const result = await productService.likeProduct(id, req.user);

  return res.status(200).send({ message: 'Like!', result });
}

export async function dislikeProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const result = await productService.dislikeProduct(id, req.user);

  return res.status(200).send({ message: 'Dislike!', result });
}
