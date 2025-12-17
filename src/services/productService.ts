import productRepository from '../repositories/productRepository';
import productLikeRepository from '../repositories/productLikeRepository';
import { ProductFindOptions } from '../libs/interfaces';


class ProductService {
    async likeProduct(userId: number, productId: number) {
        const existingLike = await productLikeRepository.find(userId, productId);

        if (existingLike) {
            await productLikeRepository.remove(existingLike.id);
            return { liked: false };
        } else {
            await productLikeRepository.create(userId, productId);
            return { liked: true };
        }
    }

    async getProductById(productId: number, userId: number) {
        const product = await productRepository.findById(productId, userId);
        const { productLikes, ...rest } = product;
        return { ...rest, isLiked: productLikes.length > 0 };
    }

    async getProducts(findOptions: ProductFindOptions, userId: number) {
        const products = await productRepository.findAll(findOptions, userId);
        return products.map((product) => {
            const { productLikes, ...rest } = product;
            return { ...rest, isLiked: productLikes.length > 0 };
        });
    }
}

export const productService = new ProductService();
