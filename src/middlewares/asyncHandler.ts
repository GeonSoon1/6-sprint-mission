import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../lib/types';

/**
 * 비동기 요청 핸들러의 타입 정의
 */
type AsyncRequestHandler = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => Promise<any>;

/**
 * 비동기 콘트롤 함수를 위한 래퍼 함수.
 * 콘트롤러에서 발생한 비동기 에러를 잡아 Express의 에러 핸들러로 전달한다.
 * @param {AsyncRequestHandler} requestHandler - 비동기 로직을 포함하는 컨트롤러 함수
 */
export const asyncHandler = (requestHandler: AsyncRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req as AuthRequest, res, next)).catch(next);
  };
};
