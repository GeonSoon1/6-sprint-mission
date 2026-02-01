import { Prisma } from '@prisma/client';
import {
  AuthorizeError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  IsSamePasswordError,
} from '../../libs/error';
import { Request, Response, NextFunction } from 'express';

function defaultNotFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return res.status(404).send({ message: '존재하지 않습니다' });
}

interface CustomError extends Error {
  // 커스텀 에러를 만들고 Error 내장 객체 타입 상속
  code?: string;
  path?: string[];
}

function globalErrorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (process.env.NODE_ENV !== 'test') {
    console.log(err);
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(400).json({ message: '이미 존재하는 데이터입니다.' });
    }
    if (err.code === 'P2025') {
      return res
        .status(404)
        .json({ message: '해당 데이터를 찾을 수 없습니다.' });
    } else {
      return res
        .status(500)
        .json({ message: '데이터 처리 중 오류가 발생했습니다.' });
    }
  }
  if (err instanceof NotFoundError) {
    return res.status(404).send({ message: err.message });
  }
  if (err instanceof BadRequestError) {
    return res.status(400).send({ message: err.message });
  }
  if (err instanceof ForbiddenError) {
    return res.status(403).send({ message: err.message });
  }
  if (err instanceof AuthorizeError) {
    return res.status(403).send({ message: err.message });
  }
  if (err instanceof IsSamePasswordError) {
    return res.status(403).send({ message: err.message });
  }
  if (err.name === 'StructError') {
    if (err.path?.[0] === 'password') {
      // 옵셔널 체이닝 : 값이 있으면 접근하고, 없으면 undefined 반환
      return res
        .status(400)
        .json({ message: '비밀번호는 8자 이상 20자 이하로 입력해야 합니다.' });
    } else {
      return res.status(400).json({ message: '잘못된 요청입니다.' });
    }
  }
  if (err.code === 'credentials_required') {
    return res.status(401).json({ message: '접근할 수 없는 권한 입니다.' });
  }
  res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' });
}

export { defaultNotFoundHandler, globalErrorHandler };
