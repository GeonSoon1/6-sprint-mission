import { Request, Response } from 'express';
import { ProductService } from '../services/productService';
import {
  ProductCreateDto,
  ProductQueryDto,
  ProductUpdateDto,
} from '../dto/productDto';
import { ProductRepository } from '../repogitories/productRepogitory';

export class ProductController {
  constructor(private service: ProductService) {}

  async create(req: Request, res: Response) {
    const dto: ProductCreateDto = {
      ...req.validatedProductCreate!,
      userId: req.user!.id,
    };
    const data = await this.service.create(dto);
    res.status(201).json(data);
  }

  async getProducts(req: Request, res: Response) {
    const dto: ProductQueryDto = {
      page: req.validatedProductQuery!.page || 1,
      limit: req.validatedProductQuery!.limit || 10,
      search: req.validatedProductQuery!.search || '',
      sort: req.validatedProductQuery!.sort || 'recent',
      userId: req.auth?.userId ?? null,
    };

    const data = await this.service.getProducts(dto);
    res.status(200).json(data);
  }

  async getById(req: Request, res: Response) {
    const id = req.validatedId!.id;
    const userId = req.auth?.userId ?? null;

    const data = await this.service.getById(id, userId);
    res.status(200).json(data);
  }

  async update(req: Request, res: Response) {
    const id = req.validatedId!.id;
    const dto: ProductUpdateDto = {
      ...Object.fromEntries(
        Object.entries(req.validatedProductUpdate!).filter(
          ([_, v]) => v !== undefined
        )
      ),
      userId: req.user!.id,
    };

    const updated = await this.service.update(id, dto);
    res.status(200).json(updated);
  }

  async delete(req: Request, res: Response) {
    const id = req.validatedId!.id;
    await this.service.delete(id);
    res.status(204).json();
  }
}

// router에서 사용할 수 있도록 조립
const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
export const productController = new ProductController(productService);
