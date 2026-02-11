import productRepository from '../repositories/productRepository';
import productLikeRepository from './productLikeRepository';
import { ProductFindOptions, ProductPublicData } from '../libs/interfaces';
import { Notification } from '@prisma/client';


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
    async createProducts(userFields: ProductPublicData) {
        const product = await productRepository.create(userFields);
        return product;
    }
    async updateProduct(id: number, userFields: ProductPublicData) {
        const oldProduct = await productRepository.findByIdSimple(id);

        const updatedProduct = await productRepository.update(id, userFields);
        // 3. 알림 로직: 가격이 존재하고, 이전 가격과 다를 때
        let notifications: Notification[] = []; // 컨트롤러로 보낼 알림 목록

        if (oldProduct && userFields.price !== undefined && oldProduct.price !== userFields.price) {
            // 3-1. 찜한 유저들 찾기
            const likers = await productRepository.findLikers(id);

            // 3-2. 각 유저에게 알림 DB 저장 (Promise.all로 병렬 처리)
            notifications = await Promise.all(
                likers.map(async (liker) => {
                    const message = `찜한 상품 '${updatedProduct.name}'의 가격이 변경되었습니다. (${oldProduct.price}원 -> ${updatedProduct.price}원)`;
                    return await productRepository.createNotification(liker.userId, message);
                })
            );
        }

        // 4. 결과 반환 (기존에는 product만 줬지만, 이제 알림 목록도 같이 줌)
        return { product: updatedProduct, notifications };
    }
    async deleteProduct(id: number) {
        return await productRepository.ondelete(id);
    }

}

export const productService = new ProductService();
