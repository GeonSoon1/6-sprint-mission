import bcrypt from 'bcrypt';
import prisma from '../lib/prismaclient.js';

export async function userInfo(req, res) {
  const userId = req.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  const { password: _, ...userInfo } = user;
  res.status(200).json(userInfo);
}

export async function updateUserInfo(req, res) {
  const userId = req.user.id;
  const { email, nickname, image, ...secret } = req.body;
  // 변경 가능한 정보를 제외 한 나머지 정보는 secret에 담아둠

  if (email) return res.status(400).json({ message: 'Cannot updete email' });

  // user 검증
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) return res.status(401).json({ message: 'Unauthorized' });

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

export async function updatePassword(req, res) {
  const userId = req.user.id;

  // user 검증
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  // 사용자가 입력한 패스워드 정보 받음
  const { password, newPassword, checkNewPassword } = req.body;

  // password가 기존과 동일한지 확인
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid)
    return res.status(401).json({ message: 'password Recheck please!' });

  // 신규 입력한 비밀번호와 확인용 비밀번호가 동일한지 확인
  if (!(newPassword === checkNewPassword))
    return res.status(401).json({ message: 'new password Recheck please!' });

  // 신규로 입력 한 비밀번호 저장
  const salt = await bcrypt.genSalt();
  const hashedNewPassword = await bcrypt.hash(newPassword, salt);

  const updateHashedPassword = await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });

  res.status(200).json({ message: 'change password!' });
}
