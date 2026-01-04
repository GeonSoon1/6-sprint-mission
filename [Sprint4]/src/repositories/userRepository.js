export class UserRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 회원가입
  async createUser(data, options) {
    return this.prisma.create({ data, ...options });
  }

  // 회원정보수정
  async patchUser(id, data, options) {
    return this.prisma.update({ where: { id }, data, ...options });
  }

  // 회원탈퇴(삭제)
  async deleteUser(id) {
    return this.prisma.delete({ where: { id } });
  }

  // 이메일 또는 닉네임으로 사용자 찾기
  async findUserByEmailOrNickname(email, nickname) {
    return this.prisma.findFirst({
      where: {
        OR: [{ email }, { nickname }],
      },
    });
  }

  // 회원정보 보기
  async findUserById(id) {
    return this.prisma.findUnique({
      where: { id },
    });
  }

  // 회원찾기
  async findUsers(findOptions) {
    return this.prisma.findMany(findOptions);
  }
}
