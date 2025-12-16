import type { Prisma, PrismaClient, User } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types/di';

@injectable()
export class AuthRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  /**
   * 회원가입
   * Prisma.UserCreateInput은 생성할 때 사용하는 타입과 필수 필드를 포함한다
   */
  async signUp(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data }); //await 생략
  }

  /**
   * 이메일로 사용자 찾기
   */
  async findUserByEmail(email: User['email']) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  /**
   * 닉네임으로 사용자 찾기
   */
  async findUserByNickname(nickname: User['nickname']) {
    return this.prisma.user.findUnique({ where: { nickname } });
  }

  /**
   * 리프레시 토큰 업데이트
   */
  async updateRefreshToken(id: User['id'], refreshToken: string | null) {
    return this.prisma.user.update({
      where: { id },
      data: { refreshToken },
    });
  }
}
