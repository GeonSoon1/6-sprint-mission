import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { UserService } from '@services';
import { TYPES } from '@types';
import { NotFoundError } from '@lib';

@injectable()
export class UserController {
  constructor(@inject(TYPES.UserService) private readonly userService: UserService) {}

  /**
   * 회원 ID로 회원 찾기
   */
  getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await this.userService.findUserById(id);
    if (!user) {
      throw new NotFoundError('사용자를 찾을 수 없습니다.');
    }

    const { password, ...restUser } = user;
    res.status(200).json({ message: '사용자 검색 완료!', user: restUser });
  };

  /**
   * 회원정보 수정
   */
  updateUser = async (req: Request, res: Response) => {
    const userId = req.user!.id;
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
  deleteUser = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { password } = req.body;

    await this.userService.deleteUser(userId, password);
    res.status(200).send();
  };

  /**
   * 회원검색
   */
  getSearchUsers = async (req: Request, res: Response) => {
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
