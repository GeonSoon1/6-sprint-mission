import { Product } from '@prisma/client';
import {
  ProductCreateDto,
  ProductQueryDto,
  ProductUpdateDto,
} from '../dto/productDto';
import { ProductRepository } from '../repogitories/productRepogitory';

type GetProduct = Omit<
  Product,
  'description' | 'tags' | 'updatedAt' | 'userId'
> & { isLiked?: boolean };
type GetProductById = Omit<Product, 'updatedAt' | 'userId'> & {
  isLiked?: boolean;
};

export class ProductService {
  constructor(private repo: ProductRepository) {}

  async create(dto: ProductCreateDto): Promise<Product> {
    return this.repo.create(dto);
  }

  async getProducts(dto: ProductQueryDto): Promise<GetProduct[]> {
    const products = await this.repo.findAll(dto);

    if (!dto.userId) return products;

    const likedProductIds = await this.repo.findLikedProductsByUser(dto.userId);

    return products.map((p) => ({
      ...p,
      isLiked: likedProductIds.includes(p.id),
    }));
  }

  async getById(id: string, userId: string | null): Promise<GetProductById> {
    const product = await this.repo.findById(id);

    if (!userId) return product;

    const liked = await this.repo.findLikedByUser(userId, id);
    return {
      ...product,
      isLiked: !!liked,
    };
  }

  async update(id: string, dto: ProductUpdateDto): Promise<Product> {
    return this.repo.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async getUserProducts(userId: string): Promise<Product[]> {
    return this.repo.findByUserId(userId);
  }
}
