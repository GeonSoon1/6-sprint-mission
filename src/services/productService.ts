import {
  ProductCreateDto,
  ProductQueryDto,
  ProductUpdateDto,
} from '../dto/productDto';
import { ProductRepository } from '../repogitories/productRepogitory';

export class ProductService {
  constructor(private repo: ProductRepository) {}

  async create(dto: ProductCreateDto) {
    return this.repo.create(dto);
  }

  async getProducts(dto: ProductQueryDto) {
    const products = await this.repo.findAll(dto);

    if (!dto.userId) return products;

    const likedProductIds = await this.repo.findLikedProductsByUser(dto.userId);

    return products.map((p) => ({
      ...p,
      isLiked: likedProductIds.includes(p.id),
    }));
  }

  async getById(id: string, userId: string | null) {
    const product = await this.repo.findById(id);

    if (!userId) return product;

    const liked = await this.repo.findLikedByUser(userId, id);
    return {
      ...product,
      isLiked: !!liked,
    };
  }

  async update(id: string, dto: ProductUpdateDto) {
    return this.repo.update(id, dto);
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }
}
