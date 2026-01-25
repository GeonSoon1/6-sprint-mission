import { create } from "superstruct";
import {
  CreateProductBodyStruct,
  UpdateProductBodyStruct,
} from "../structs/product.struct.js";
import * as productServices from "../services/product.service.js";
import { IdParamsStruct } from "../structs/common.struct.js";
import { CreateCommentBodyStruct } from '../structs/comment.struct.js'
import * as commentServices from '../services/comment.service.js'

export async function createProduct(req, res) {
  const data = create(req.body, CreateProductBodyStruct);
  const product = await productServices.createProduct(data, req.user);
  return res.json(product);
}

export async function getProduct(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const product = await productServices.getProduct(id, req.user.id);
  return res.json(product);
}

export async function updateProduct(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateProductBodyStruct);
  const updatedProduct = await productServices.updateProduct(
    id,
    data,
    req.user
  );
  return res.json(updatedProduct);
}

export async function deleteProduct(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  await productServices.deleteProduct(id, req.user);
  return res.json({ message: 'Successfully Deleted' });
}

// Comment 생성
export async function createProductComment(req, res) {
  const { id } = create(req.params, IdParamsStruct)
  const data = create(req.body, CreateCommentBodyStruct)
  const comment = await commentServices.createComment(
    {
      content: data.content,
      productId: id,
      articleId: null,
    },
    req.user
  )
  return res.json(comment)
}

// getMyProduct 상품 조회
export async function getMyProduct(req, res) {
  const product = await productServices.getMyProduct(req.user)
  return res.json(product)
}
