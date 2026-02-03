import { Request, Response } from 'express';
import { ProductService } from '../products/product.service';
export declare class ProductController {
    private service;
    constructor(service: ProductService);
    create(req: Request, res: Response): Promise<void>;
    getProducts(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
}
export declare const productController: ProductController;
//# sourceMappingURL=product.controller.d.ts.map