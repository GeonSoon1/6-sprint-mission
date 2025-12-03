import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/userRepository.js';
import { productRepository } from '../repositories/productRepository.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
export class UserService {
    async getMe(userId) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError('user', userId);
        }
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async updateMe(userId, data) {
        const updatedUser = await userRepository.update(userId, data);
        const { password: _, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }
    async updatePassword(userId, data) {
        const { password, newPassword } = data;
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError('user', userId);
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid credentials');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await userRepository.updatePassword(userId, hashedPassword);
    }
    async getMyProductList(userId, query) {
        const totalCount = await productRepository.count(query, userId);
        const products = await productRepository.findMany(query, userId);
        const productsWithFavorites = products.map((product) => {
            const { favorites, ...productWithoutFavorites } = product;
            return {
                ...productWithoutFavorites,
                favoriteCount: favorites.length,
                isFavorited: favorites.some((favorite) => favorite.userId === userId),
            };
        });
        return {
            list: productsWithFavorites,
            totalCount,
        };
    }
    async getMyFavoriteList(userId, query) {
        const totalCount = await productRepository.countUserFavorites(userId, query);
        const products = await productRepository.findUserFavorites(userId, query);
        const productsWithFavorites = products.map((product) => {
            const { favorites, ...productWithoutFavorites } = product;
            return {
                ...productWithoutFavorites,
                favoriteCount: favorites.length,
                isFavorited: true,
            };
        });
        return {
            list: productsWithFavorites,
            totalCount,
        };
    }
}
export const userService = new UserService();
//# sourceMappingURL=userService.js.map