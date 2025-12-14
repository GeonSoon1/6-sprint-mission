import { prisma } from '../lib/constants';
import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { UserRepository } from '../repositories/userRepository';
import { AuthRequest } from '../lib/types';

export class UserController {
  constructor(private userService: UserService) {}

  /**
   * 회원 ID로 회원 찾기
   */
  public getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await this.userService.findUserById(id);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const { password, ...restUser } = user;
    res.status(200).json({ message: '사용자 검색 완료!', user: restUser });
  };

  /**
   * 회원정보 수정
   */
  public updateUser = async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;
    const updatedUser = await this.userService.updateUser(userId, req.body);

    const { password, ...userData } = updatedUser;
    res.status(200).json({
      message: '사용자 정보를 수정했습니다.',
      user: userData,
    });
  };

  /**
   * 회원 탈퇴(삭제)
   */
  public deleteUser = async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;
    const { password } = req.body;

    await this.userService.deleteUser(userId, password);
    res.status(200).send();
  };

  /**
   * 회원검색
   */
  public getSearchUsers = async (req: Request, res: Response) => {
    const { nickname } = req.query;

    const findOptions: any = {};
    if (nickname && typeof nickname === 'string') {
      findOptions.where = {
        nickname: { contains: nickname },
      };
    }

    const users = await this.userService.findUsers(findOptions);
    res.status(200).json({ message: '사용자 검색 완료!', users });
  };
}
