import { Request, Response } from 'express';
import { assert } from 'superstruct';
import { CreateProduct, PatchProduct } from '../structs/productStructs';
import { CreateComment } from '../structs/commentStructs';
import { AuthenticatedRequest } from '../types/auth';
import productService from '../service/productService';

class ProductController {
  async getProducts(
    req: Request<
      any,
      any,
      any,
      { offset?: string; limit?: string; order?: string; search?: string }
    >,
    res: Response,
  ) {
    const { offset = '0', limit = '10', order = 'newest', search = '' } = req.query;

    const products = await productService.getProducts(
      parseInt(offset),
      parseInt(limit),
      order,
      search,
    );

    res.send(products);
  }

  async createProduct(req: AuthenticatedRequest, res: Response) {
    assert(req.body, CreateProduct);

    const product = await productService.createProduct(req.body, req.user.id);

    res.status(201).send(product);
  }

  async getProductById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const product = await productService.getProductById(id);
    res.send(product);
  }

  async updateProduct(req: AuthenticatedRequest<{ id: number }>, res: Response) {
    assert(req.body, PatchProduct);

    const id = Number(req.params.id);
    const updated = await productService.updateProduct(id, req.body, req.user.id);

    res.send(updated);
  }

  async deleteProduct(req: AuthenticatedRequest<{ id: number }>, res: Response) {
    const id = Number(req.params.id);
    await productService.deleteProduct(id, req.user.id);
    res.sendStatus(204);
  }

  async createComment(req: Request, res: Response) {
    assert(req.body, CreateComment);

    const productId = Number(req.params.id);
    const { content } = req.body;

    const comment = await productService.createComment(productId, content);
    res.status(201).send(comment);
  }

  async getComment(
    req: Request<{ id: string }, any, any, { cursor?: number; limit?: string }>,
    res: Response,
  ) {
    const productId = Number(req.params.id);
    const cursor = req.query.cursor;
    const limit = parseInt(req.query.limit || '10');

    const result = await productService.getComments(productId, cursor, limit);
    res.send(result);
  }
}

export default new ProductController();
