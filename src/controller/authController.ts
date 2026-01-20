import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';
import { Request, Response } from 'express';
import NotFoundError from '../lib/errors/NotFoundError';
import { generateTokens, verifyRefreshToken } from '../lib/token';
import { clearTokenCookies, setTokenCookies } from '../lib/cookie';
import { REFRESH_TOKEN_COOKIE_NAME } from '../lib/constants';
import ValidationError from '../lib/errors/ValidationError';
import ConflictError from '../lib/errors/ConflictError';
import authService from '../service/authService';

class AuthController {
  //회원가입
  async register(req: Request, res: Response) {
    //이메일, 닉네임, 비밀번호 받기
    const { email, nickname, password } = req.body;
    //입력값 검증
    const user = await authService.register(email, nickname, password);

    //비밀번호 제외 출력
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).send(userWithoutPassword);
  }

  //로그인
  async login(req: Request, res: Response) {
    const { nickname, password } = req.body;

    const { accessToken, refreshToken } = await authService.login(nickname, password);
    setTokenCookies(res, accessToken, refreshToken);

    res.status(200).send();
  }

  //토큰 재발급
  async refreshTokens(req: Request, res: Response) {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    // 토큰 확인
    if (!refreshToken) {
      throw new NotFoundError('토큰이 존재하지 않습니다.');
    }
    //토큰 유효성 검사, 유저 아이디 추출
    const { userId } = verifyRefreshToken(refreshToken);

    //새 토큰 생성
    const { accessToken, newRefreshToken } = await authService.refreshTokens(userId);
    //쿠키에 토큰 저장
    setTokenCookies(res, accessToken, newRefreshToken);
    res.status(200).send();
  }

  async logout(req: Request, res: Response) {
    clearTokenCookies(res);
    res.status(200).send();
  }
}

export default new AuthController();
