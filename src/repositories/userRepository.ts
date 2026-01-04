import type { Prisma, PrismaClient, User } from '@prisma/client';

export class UserRepository {
  constructor(private prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * 회원정보수정
   */
  async updateUser(id: User['id'], data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id }, data });
  }

  /**
   * 회원탈퇴(삭제)
   */
  async deleteUser(id: User['id']) {
    return this.prisma.user.delete({ where: { id } });
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
    if (!email && !nickname) {
      return null;
    }
    return this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { nickname }],
      },
    });
  }

  /**
   * 회원정보 찾기
   */
  async findUserById(id: User['id']) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  /**
   * 회원찾기
   * findMany: where, orderBy, take(개수제한), skip(건너뛰기)등 다양한 옵션 제공
   * UserFindManyArgs는 모든 옵션을 포함
   */
  async findUsers(findOptions: Prisma.UserFindManyArgs) {
    return this.prisma.user.findMany(findOptions);
  }
}
