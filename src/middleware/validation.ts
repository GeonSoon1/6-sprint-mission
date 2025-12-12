import type { Request, Response, NextFunction } from 'express';

export const validateProduct = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, description, price } = req.body as {
    name?: string;
    description?: string;
    price?: number;
  };

  if (!name || !description || price === undefined) {
    return res.status(400).json({
      message: '이름,설명, 혹은 가격이 없습니다.',
    });
  }

  if (price < 0) {
    return res.status(400).json({ message: '가격이 0보다 작습니다.' });
  }

  next();
};

export const validateArticle = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, content } = req.body as { title?: string; content?: string };

  if (!title || !content) {
    return res.status(400).json({
      message: '내용이 없습니다.',
    });
  }

  next();
};

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, nickname, password } = req.body as {
    email?: string;
    nickname?: string;
    password?: string;
  };

  if (!email || !nickname || !password) {
    return res.status(400).json({
      message: '이메일, 닉네임, 비밀번호를 모두 입력해주세요.',
    });
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({
      message: '이메일과 비밀번호를 모두 입력해주세요.',
    });
  }

  next();
};

export const validatePatchProfile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, nickname, image } = req.body as {
    email?: string;
    nickname?: string;
    image?: string;
  };

  if (!email && !nickname && typeof image === 'undefined') {
    return res.status(400).json({
      message: '변경할 값을 하나 이상 입력해주세요.',
    });
  }

  next();
};

export const validateChangePassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { currentPassword, newPassword } = req.body as {
    currentPassword?: string;
    newPassword?: string;
  };

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      message: '현재 비밀번호와 새 비밀번호를 모두 입력해주세요.',
    });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({
      message: '현재 비밀번호와 새 비밀번호가 같습니다.',
    });
  }

  next();
};

export const validateComment = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { content } = req.body as { content?: string };

  if (!content) {
    return res.status(400).json({ message: '댓글 내용이 비어있습니다.' });
  }

  next();
};
