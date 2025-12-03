import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/userRepository.js';
import { productRepository } from '../repositories/productRepository.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import { UpdateUserDTO, UpdatePasswordDTO, ProductListQueryDTO, ProductResponseDTO, UserWithoutPassword } from '../types/index.js';

export class UserService {
  async getMe(userId: number): Promise<UserWithoutPassword> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('user', userId);
    }

    const { password: _, ...userWithoutPassword }: { password: string } & UserWithoutPassword = user;
    return userWithoutPassword;
  }

  async updateMe(userId: number, data: UpdateUserDTO): Promise<UserWithoutPassword> {
    const updatedUser = await userRepository.update(userId, data);
    const { password: _, ...userWithoutPassword }: { password: string } & UserWithoutPassword = updatedUser;
    return userWithoutPassword;
  }

  async updatePassword(userId: number, data: UpdatePasswordDTO): Promise<void> {
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

  async getMyProductList(userId: number, query: ProductListQueryDTO): Promise<{ list: ProductResponseDTO[]; totalCount: number }> {
    const totalCount = await productRepository.count(query, userId);
    const products = await productRepository.findMany(query, userId);

    const productsWithFavorites: ProductResponseDTO[] = products.map((product) => {
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

  async getMyFavoriteList(userId: number, query: ProductListQueryDTO): Promise<{ list: ProductResponseDTO[]; totalCount: number }> {
    const totalCount = await productRepository.countUserFavorites(userId, query);
    const products = await productRepository.findUserFavorites(userId, query);

    const productsWithFavorites: ProductResponseDTO[] = products.map((product) => {
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

