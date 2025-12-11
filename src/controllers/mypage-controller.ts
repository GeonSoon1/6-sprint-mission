import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../lib/prismaclient';

export async function userInfo(req: Request, res: Response) {
  const checkUser = req.user;

  const { password: _, ...userInfo } = checkUser;
  res.status(200).json(userInfo);
}

export async function updateUserInfo(req: Request, res: Response) {
  const userId = req.userId;
  const { nickname, image, ...secret } = req.body;

  const updateUser = await prisma.user.update({
    where: { id: userId },
    data: {
      nickname,
      image,
    },
  });

  const { password: _, ...updateUserInfo } = updateUser;

  res.status(200).json(updateUserInfo);
}

export async function updatePassword(req: Request, res: Response) {
  const userId = req.userId;

  // 사용자가 입력한 패스워드 정보 받음
  const { newPassword, ...passwords } = req.body;

  // 신규로 입력 한 비밀번호 저장
  const salt = await bcrypt.genSalt();
  const hashedNewPassword = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });

  res.status(200).json({ message: '비밀번호가 변경 되었습니다' });
}
