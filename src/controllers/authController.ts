import type { Request, Response } from 'express';
import { AuthService } from '../services';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types/di';
import { UnauthorizedError } from '../lib/errors';

@injectable()
export class AuthController {
  constructor(@inject(TYPES.AuthService) private readonly authService: AuthService) {}

  /**
   * 회원가입(signUp)
   */
  public signUp = async (req: Request, res: Response) => {
    const newUser = await this.authService.signUp(req.body);
    const { password, ...newUserData } = newUser;
    res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      user: newUserData,
    });
  };

  /**
   * 로그인(login)
   */
  public login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await this.authService.login({
      email,
      password,
    });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.status(200).json({ message: '로그인에 성공했습니다.', accessToken });
  };

  /**
   * 로그아웃(logout)
   */
  public logout = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    await this.authService.logout(userId);
    res.clearCookie('refreshToken');
    res.status(204).send();
  };

  /**
   * 토큰 재발급(refresh)
   */
  public refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh Token이 존재하지 않습니다.');
    }
    const { accessToken } = await this.authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      message: 'Access Token이 재발급되었습니다.',
      accessToken,
    });
  };
}
