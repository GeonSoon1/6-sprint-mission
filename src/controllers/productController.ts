import type { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { CreateProductDTO } from '@dto';
import { ProductService } from '@services';
import { TYPES } from '@types';

@injectable()
export class ProductController {
  constructor(
    @inject(TYPES.ProductService)
    private readonly productService: ProductService,
  ) {}

  // 상품 생성 콘트롤러
  createProduct = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const product: CreateProductDTO = req.body;

    const newProduct = await this.productService.createProduct(userId, product);
    res.status(201).json(newProduct);
  };

  // 상품목록조회
  getProducts = async (req: Request, res: Response) => {
    const { skip, take } = (req as any).pagination;
    const products = await this.productService.findProducts({ skip, take });
    res.status(200).json({ products });
  };

  // 상품상세 조회
  getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const product = await this.productService.findProductById(id);
    res.status(200).json(product);
  };

  // 상품 수정
  updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const product = req.body;

    const updatedProduct = await this.productService.updateProduct(id, userId, product);
    res.status(200).json(updatedProduct);
  };

  // 상품 삭제
  deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    await this.productService.deleteProduct(id, userId);
    res.status(204).send();
  };
}
