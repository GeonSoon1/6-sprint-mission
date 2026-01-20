import bcrypt from 'bcrypt';
import NotFoundError from '../lib/errors/NotFoundError';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import ValidationError from '../lib/errors/ValidationError';
import userRepository from '../repository/userRepository';

class UserService {
  async getMe(userId?: number) {
    if (!userId) {
      throw new UnauthorizedError('해당 유저가 없습니다.');
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('해당 유저가 없습니다.');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateMe(userId?: number, data?: any) {
    if (!userId) {
      throw new UnauthorizedError('해당 유저가 없습니다.');
    }

    const user = await userRepository.updateById(userId, data);
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateMyPassword(userId?: number, currentPassword?: string, newPassword?: string) {
    if (!userId) {
      throw new UnauthorizedError('해당 유저가 없습니다.');
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('해당 유저가 없습니다.');
    }

    const isValid = await bcrypt.compare(currentPassword!, user.password);
    if (!isValid) {
      throw new ValidationError('비밀번호가 일치하지 않습니다.');
    }

    const hashed = await bcrypt.hash(newPassword!, 10);

    await userRepository.updateById(userId, { password: hashed });

    return { message: '비밀번호가 변경되었습니다.' };
  }

  async getMyProducts(userId?: number) {
    if (!userId) {
      throw new UnauthorizedError('해당 유저가 없습니다.');
    }

    return userRepository.findMyProducts(userId);
  }

  async getLikedProducts(userId?: number) {
    if (!userId) {
      throw new ValidationError('로그인이 필요합니다.');
    }

    const likes = await userRepository.findLikedProductIds(userId);

    if (likes.length === 0) {
      return [];
    }

    const productIds = likes.map((l) => l.productId);

    const products = await userRepository.findProductsByIds(productIds);

    return products.map((product) => ({
      ...product,
      isLiked: true,
    }));
  }
}

export default new UserService();
