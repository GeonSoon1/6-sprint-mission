import { Request, Response, NextFunction } from 'express';
import { assert } from 'superstruct';
import bcrypt from 'bcrypt';
import { CreateUser, UpdateUser } from '../structs/userStructs';

export function userCreateValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    assert(req.body, CreateUser);
    next();
  } catch (err) {
    next(err);
  }
}

export function userUpdateValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, ...others } = req.body;

    if (email)
      return res.status(400).json({ message: '이메일은 변경 할 수 없습니다' });

    assert(req.body, UpdateUser);

    next();
  } catch (err) {
    next(err);
  }
}

export async function userUpdatePasswordValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;

    // password가 기존과 동일한지 확인
    const { password, newPassword, checkNewPassword } = req.body;
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(401).json({ message: '기존 패스워드를 확인 바랍니다' });

    // 신규 입력한 비밀번호와 확인용 비밀번호가 동일한지 확인
    if (!(newPassword === checkNewPassword))
      return res
        .status(401)
        .json({ message: '신규 비밀번호와 신규확인 비밀번호가 다릅니다' });

    next();
  } catch (err) {
    next(err);
  }
}
