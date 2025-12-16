import prisma from '../utils/prisma';
import { User, RefreshToken } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';

export class UserRepository {
  /**
   * 사용자 생성
   * @param data - 생성할 사용자 데이터
   * @returns 생성된 사용자
   */
  async create(data: CreateUserDto & { password: string }): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  /**
   * ID로 사용자 조회
   * @param id - 사용자 ID
   * @returns 사용자 또는 null
   */
  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * 이메일로 사용자 조회
   * @param email - 사용자 이메일
   * @returns 사용자 또는 null
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * 사용자 정보 수정
   * @param id - 사용자 ID
   * @param data - 수정할 데이터
   * @returns 수정된 사용자
   */
  async update(id: number, data: UpdateUserDto): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * 비밀번호 변경
   * @param id - 사용자 ID
   * @param hashedPassword - 해시된 새 비밀번호
   * @returns 수정된 사용자
   */
  async updatePassword(id: number, hashedPassword: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  /**
   * 사용자 삭제
   * @param id - 사용자 ID
   */
  async delete(id: number): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Refresh Token 생성
   * @param userId - 사용자 ID
   * @param token - Refresh Token 문자열
   * @param expiresAt - 만료 시간
   * @returns 생성된 Refresh Token
   */
  async createRefreshToken(userId: number, token: string, expiresAt: Date): Promise<RefreshToken> {
    return prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  /**
   * Refresh Token 조회
   * @param token - Refresh Token 문자열
   * @returns Refresh Token 또는 null
   */
  async findRefreshToken(token: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({
      where: { token },
    });
  }

  /**
   * 사용자의 모든 Refresh Token 조회
   * @param userId - 사용자 ID
   * @returns Refresh Token 배열
   */
  async findRefreshTokensByUserId(userId: number): Promise<RefreshToken[]> {
    return prisma.refreshToken.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Refresh Token 삭제
   * @param token - Refresh Token 문자열
   */
  async deleteRefreshToken(token: string): Promise<void> {
    await prisma.refreshToken.delete({
      where: { token },
    });
  }

  /**
   * 사용자의 모든 Refresh Token 삭제 (로그아웃 올 디바이스)
   * @param userId - 사용자 ID
   */
  async deleteAllRefreshTokens(userId: number): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  /**
   * 만료된 Refresh Token 삭제
   */
  async deleteExpiredRefreshTokens(): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  /**
   * 모든 사용자 조회 (관리자용)
   * @param skip - 건너뛸 개수
   * @param take - 가져올 개수
   * @returns 사용자 배열과 총 개수
   */
  async findAll(skip: number = 0, take: number = 10): Promise<{ users: User[]; total: number }> {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    return { users, total };
  }

  /**
   * 닉네임으로 사용자 검색
   * @param nickname - 검색할 닉네임
   * @returns 사용자 배열
   */
  async searchByNickname(nickname: string): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        nickname: {
          contains: nickname,
          mode: 'insensitive',
        },
      },
      take: 10,
    });
  }

  /**
   * 사용자 존재 여부 확인
   * @param id - 사용자 ID
   * @returns 존재 여부
   */
  async exists(id: number): Promise<boolean> {
    const count = await prisma.user.count({
      where: { id },
    });
    return count > 0;
  }

  /**
   * 이메일 중복 확인
   * @param email - 확인할 이메일
   * @param excludeUserId - 제외할 사용자 ID (수정 시 자신의 이메일 제외)
   * @returns 중복 여부
   */
  async isEmailTaken(email: string, excludeUserId?: number): Promise<boolean> {
    const count = await prisma.user.count({
      where: {
        email,
        ...(excludeUserId && { id: { not: excludeUserId } }),
      },
    });
    return count > 0;
  }
}
