import { UserRepository } from "../repositories/user.repository";
import {
  CreateUserDto,
  LoginDto,
  UpdateUserDto,
  ChangePasswordDto,
  UserResponseDto,
  AuthResponseDto,
} from "../dtos/user.dto";
import { hashPassword, comparePassword } from "../utils/password";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiration,
} from "../utils/jwt";
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} from "../utils/errors";
import { User } from "@prisma/client";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  // 비밀번호를 제외한 사용자 정보 반환
  private excludePassword(user: User): UserResponseDto {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // 회원가입
  async signup(data: CreateUserDto): Promise<AuthResponseDto> {
    // 이메일 중복 확인
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError("이미 존재하는 이메일입니다.");
    }

    // 비밀번호 해싱
    const hashedPassword = await hashPassword(data.password);

    // 사용자 생성
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    // JWT 토큰 생성
    const tokenPayload = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Refresh Token 저장
    await this.userRepository.createRefreshToken(
      user.id,
      refreshToken,
      getRefreshTokenExpiration()
    );

    return {
      user: this.excludePassword(user),
      accessToken,
      refreshToken,
    };
  }

  // 로그인
  async login(data: LoginDto): Promise<AuthResponseDto> {
    // 사용자 조회
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    // 비밀번호 확인
    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    // JWT 토큰 생성
    const tokenPayload = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Refresh Token 저장
    await this.userRepository.createRefreshToken(
      user.id,
      refreshToken,
      getRefreshTokenExpiration()
    );

    return {
      user: this.excludePassword(user),
      accessToken,
      refreshToken,
    };
  }

  // 토큰 갱신
  async refreshToken(
    token: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Refresh Token 조회
    const storedToken = await this.userRepository.findRefreshToken(token);
    if (!storedToken) {
      throw new UnauthorizedError("유효하지 않은 리프레시 토큰입니다.");
    }

    // 만료 확인
    if (storedToken.expiresAt < new Date()) {
      await this.userRepository.deleteRefreshToken(token);
      throw new UnauthorizedError("만료된 리프레시 토큰입니다.");
    }

    // 토큰 검증
    const decoded = verifyRefreshToken(token);

    // 사용자 조회
    const user = await this.userRepository.findById(decoded.id);
    if (!user) {
      throw new UnauthorizedError("사용자를 찾을 수 없습니다.");
    }

    // 새로운 토큰 생성
    const tokenPayload = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    // 기존 Refresh Token 삭제 및 새 토큰 저장
    await this.userRepository.deleteRefreshToken(token);
    await this.userRepository.createRefreshToken(
      user.id,
      newRefreshToken,
      getRefreshTokenExpiration()
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  // 프로필 조회
  async getProfile(userId: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("사용자를 찾을 수 없습니다.");
    }

    return this.excludePassword(user);
  }

  // 프로필 수정
  async updateProfile(
    userId: number,
    data: UpdateUserDto
  ): Promise<UserResponseDto> {
    // 사용자 존재 확인
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("사용자를 찾을 수 없습니다.");
    }

    // 프로필 업데이트
    const updatedUser = await this.userRepository.update(userId, data);
    return this.excludePassword(updatedUser);
  }

  // 비밀번호 변경
  async changePassword(userId: number, data: ChangePasswordDto): Promise<void> {
    // 사용자 조회
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("사용자를 찾을 수 없습니다.");
    }

    // 현재 비밀번호 확인
    const isPasswordValid = await comparePassword(
      data.currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new BadRequestError("현재 비밀번호가 올바르지 않습니다.");
    }

    // 새 비밀번호와 현재 비밀번호가 같은지 확인
    const isSamePassword = await comparePassword(
      data.newPassword,
      user.password
    );
    if (isSamePassword) {
      throw new BadRequestError("새 비밀번호는 현재 비밀번호와 달라야 합니다.");
    }

    // 새 비밀번호 해싱 및 저장
    const hashedPassword = await hashPassword(data.newPassword);
    await this.userRepository.updatePassword(userId, hashedPassword);
  }

  // 만료된 Refresh Token 정리 (선택적 - 스케줄러에서 호출)
  async cleanupExpiredTokens(): Promise<void> {
    await this.userRepository.deleteExpiredRefreshTokens();
  }
}
