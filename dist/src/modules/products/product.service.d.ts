import { Product } from '@prisma/client';
import { ProductCreateDto, ProductQueryDto, ProductUpdateDto } from '../products/product.dto';
import { ProductRepository } from '../products/product.repository';
import { NotificationService } from '../notifications/notification.service';
type GetProduct = Omit<Product, 'description' | 'tags' | 'updatedAt' | 'userId'> & {
    isLiked?: boolean;
};
type GetProductById = Omit<Product, 'updatedAt' | 'userId'> & {
    isLiked?: boolean;
};
export declare class ProductService {
    private repo;
    private notificationService;
    constructor(repo: ProductRepository, notificationService: NotificationService);
    create(dto: ProductCreateDto): Promise<Product>;
    getProducts(dto: ProductQueryDto): Promise<GetProduct[]>;
    getById(id: string, userId: string | null): Promise<GetProductById>;
    update(id: string, dto: ProductUpdateDto): Promise<Product>;
    delete(id: string): Promise<void>;
    getUserProducts(userId: string): Promise<Product[]>;
}
export {};
//# sourceMappingURL=product.service.d.ts.map