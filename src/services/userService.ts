import bcrypt from 'bcrypt';
import type { Prisma, User } from '@prisma/client';
import { UserRepository } from '../repositories';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types/di';
import { NotFoundError, ForbiddenError } from '../lib/errors';

@injectable()
export class UserService {
  // constructor(생성자)를 통해 UserRepository 인스턴스 주입받음
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

  /**
   * 회원정보수정
   */
  async updateUser(id: User['id'], userData: Prisma.UserUpdateInput) {
    const updateData = { ...userData };

    if (typeof updateData.password === 'string') {
      const hashedPassword = await bcrypt.hash(updateData.password, 10);
      updateData.password = hashedPassword;
    }

    return this.userRepository.updateUser(id, updateData);
  }

  /**
   *회원탈퇴(삭제)
   */
  async deleteUser(id: User['id'], passwordToCheck: string) {
    // 사용자 찾기
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new NotFoundError('사용자를 찾을 수 없습니다.');
    }

    // password 확인
    const isPasswordCorrect = await bcrypt.compare(passwordToCheck, user.password);
    if (!isPasswordCorrect) {
      throw new ForbiddenError('비밀번호가 일치하지 않습니다.');
    }

    // 확인 완료 후 userRepository에 삭제요청 전달
    return this.userRepository.deleteUser(id);
  }

  /**
   * 이메일 또는 닉네임으로 사용자 찾기
   */
  async findUserByEmailOrNickname({
    email,
    nickname,
  }: {
    email?: User['email'];
    nickname?: User['nickname'];
  }) {
    return this.userRepository.findUserByEmailOrNickname({
      email,
      nickname,
    });
  }

  /**
   * 회원정보 불러오기
   */
  async findUserById(id: User['id']) {
    return this.userRepository.findUserById(id);
  }

  /**
   * 회원검색
   */
  async findUsers(findOptions: Prisma.UserFindManyArgs) {
    return this.userRepository.findUsers(findOptions);
  }
}
