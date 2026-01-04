import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { User } from '@prisma/client';
import { UserRepository } from '../repositories/userRepository';
import { AuthRepository } from '../repositories/authRepository';
import { LoginDTO, SignUpDTO } from '../lib/dto';

export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private userRepository: UserRepository,
  ) {}

  /**
   * 회원가입(signUp)
   */
  async singUp(userData: SignUpDTO) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const signupData = { ...userData, password: hashedPassword };
    return this.authRepository.signUp(signupData);
  }

  /**
   * 로그인(login)
   */
  async login({ email, password }: LoginDTO) {
    // 사용자 확인
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('이메일 주소가 일치하지 않습니다.');
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }

    // 토큰 발급
    const { accessToken, refreshToken } = this._issueTokens(user);

    // refresh Token을 DB에 저장 및 반환
    await this.authRepository.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken };
  }

  /**
   * 로그아웃(logout)
   */
  async logout(userId: User['id']) {
    await this.authRepository.updateRefreshToken(userId, null);
  }

  // 리프레시 토큰
  async refreshAccessToken(token: string) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
      };

      const user = await this.userRepository.findUserById(payload.userId);

      if (!user || user.refreshToken !== token) {
        throw new Error('유효하지 않은 토큰입니다.');
      }

      const newAccessToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        {
          expiresIn: '1h',
        },
      );
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new Error('유효하지 않은 토큰입니다.');
    }
  }

  /**
   * Access Token과 Refresh Token을 발급
   */
  private _issueTokens(user: User) {
    const payload = { userId: user.id };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '1h', //유효기간 1시간
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '7d', // 유효기간 7일
    });
    return { accessToken, refreshToken };
  }
}
