import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prismaclient';
import { OrderType, OrderByMap } from '../types/express/common.types';

export function getQueryValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // offset & limit : 숫자 변환 + 검증
    const offset = Number(req.query.offset ?? 0);
    const offsetFloat = offset % 1;

    if (isNaN(offset) || offset < 0 || offsetFloat)
      return res
        .status(401)
        .json({ message: 'offset : 올바른 숫자를 입력 해 주세요' });

    const limit = Number(req.query.limit ?? 10);
    const limitFloat = limit % 1;

    if (isNaN(limit) || limit <= 0 || limit > 100 || limitFloat)
      return res
        .status(401)
        .json({ message: 'limit : 1에서 100 사이 숫자를 입력 해 주세요' });

    // orderBy : 출력 순서 검증
    const order = String(req.query.order ?? OrderType.NEWEST);
    const orderTypeChange = order as OrderType;

    const orderBy = OrderByMap[orderTypeChange];

    // enum 검증
    if (!Object.values(OrderType).includes(order as OrderType)) {
      return res.status(401).json({
        message: 'order : newest 또는 oldest 중 한가지를 작성 해 주세요',
      });
    }

    // product - name & description : 문자 검증
    const name = String(req.query.name ?? '');
    const description = String(req.query.description ?? '');

    // article - title & content : 문자 검증
    const title = String(req.query.title ?? '');
    const content = String(req.query.content ?? '');

    req.validated = {
      offset,
      limit,
      name,
      description,
      title,
      content,
      orderBy,
    };

    next();
  } catch (err) {
    next(err);
  }
}
