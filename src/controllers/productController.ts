import type { Request, Response, NextFunction } from 'express';
import type {
  CreateProductDto,
  UpdateProductDto,
  CookieBag,
} from '../services/productService';

import {
  getProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
  getMyProductsService,
  toggleProductLikeService,
  getLikedProductsService,
} from '../services/productService';

export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cookies = req.cookies as CookieBag;
    const data = await getProductsService(cookies);
    return res.status(200).json(data);
  } catch (e) {
    next(e);
  }
}

export async function getProductById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cookies = req.cookies as CookieBag;
    const data = await getProductByIdService(req.params.id, cookies);
    return res.status(200).json(data);
  } catch (e) {
    next(e);
  }
}

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id; // authenticate에서 세팅됨
    const body = req.body as CreateProductDto;

    const product = await createProductService(body, userId);
    return res.status(201).json(product);
  } catch (e) {
    next(e);
  }
}

export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const body = req.body as UpdateProductDto;

    const updated = await updateProductService(req.params.id, body, userId);
    return res.status(200).json(updated);
  } catch (e) {
    next(e);
  }
}

export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;

    await deleteProductService(req.params.id, userId);
    return res.status(204).send();
  } catch (e) {
    next(e);
  }
}

export async function getMyProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const products = await getMyProductsService(userId);
    return res.status(200).json(products);
  } catch (e) {
    next(e);
  }
}

export async function toggleProductLike(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const result = await toggleProductLikeService(req.params.id, userId);
    return res.status(200).json(result);
  } catch (e) {
    next(e);
  }
}

export async function getLikedProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const products = await getLikedProductsService(userId);
    return res.status(200).json(products);
  } catch (e) {
    next(e);
  }
}
