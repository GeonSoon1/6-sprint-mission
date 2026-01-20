import authRepository from '../repository/authRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import ConflictError from '../lib/errors/ConflictError';
import ValidationError from '../lib/errors/ValidationError';
import bcrypt from 'bcrypt';
import { generateTokens } from '../lib/token';

class AuthService {
  //회원가입
  async register(email: string, nickname: string, password: string) {
    //입력값 검증
    if (!email) {
      throw new ValidationError('이메일은 필수입니다.');
    }
    if (!password) {
      throw new ValidationError('비밀번호는 필수입니다.');
    }
    if (!nickname) {
      throw new ValidationError('닉네임은 필수입니다.');
    }

    //중복값 검증
    const existingUser = await authRepository.findByNickname(nickname);
    if (existingUser) {
      throw new ConflictError('이미 존재하는 닉네임입니다.');
    }

    //비밀번호 해싱 과정
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //회원 생성
    const user = await authRepository.createUser(email, nickname, hashedPassword);

    return user;
  }

  //로그인
  async login(nickname: string, password: string) {
    //닉네임 확인
    const user = await authRepository.findByNickname(nickname);
    if (!user) {
      throw new NotFoundError('닉네임을 찾을 수 없습니다.');
    }

    //비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ValidationError('비밀번호가 일치하지 않습니다.');
    }

    //토큰 생성
    const { accessToken, refreshToken } = generateTokens(user.id);

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: number) {
    //유저 존재 확인
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('유저를 찾을 수 없습니다.');
    }

    //토큰 생성
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id);
    return { accessToken, newRefreshToken };
  }
}

export default new AuthService();
