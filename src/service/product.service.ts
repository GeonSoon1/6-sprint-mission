import authorize from '../middleware/authorize';
import BadRequestError from '../middleware/errors/BadRequestError';
import ForbiddenError from '../middleware/errors/ForbiddenError';

import userRepo from '../repository/user.repo';
import productRepo from '../repository/product.repo';
import articleRepo from '../repository/article.repo';
import commentRepo from '../repository/comment.repo';

jest.mock('../repository/user.repo', () => ({
  __esModule: true,
  default: { findById: jest.fn() }
}));
jest.mock('../repository/product.repo', () => ({
  __esModule: true,
  default: { findById: jest.fn() }
}));
jest.mock('../repository/article.repo', () => ({
  __esModule: true,
  default: { findById: jest.fn() }
}));
jest.mock('../repository/comment.repo', () => ({
  __esModule: true,
  default: { findById: jest.fn() }
}));

type AnyReq = any;

function makeReq(overrides: Partial<AnyReq> = {}): AnyReq {
  return {
    originalUrl: '/articles/1',
    params: { id: '1' },
    user: { id: 1 }, // authenticate가 만든다고 가정하는 핵심
    ...overrides
  };
}

function makeRes(): any {
  return {};
}

describe('authorize middleware', () => {
  const next = jest.fn();

  beforeEach(() => {
    next.mockClear();
    (userRepo.findById as jest.Mock).mockReset();
    (productRepo.findById as jest.Mock).mockReset();
    (articleRepo.findById as jest.Mock).mockReset();
    (commentRepo.findById as jest.Mock).mockReset();
  });

  test('articles: 작성자면 next() 호출', async () => {
    (articleRepo.findById as jest.Mock).mockResolvedValue({ id: 1, userId: 1 });

    const req = makeReq({ originalUrl: '/articles/1', params: { id: '1' }, user: { id: 1 } });
    const res = makeRes();

    await authorize(req, res, next);

    expect(articleRepo.findById).toHaveBeenCalledWith(1);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(); // 에러 없이
  });

  test('articles: 작성자 아니면 ForbiddenError를 next(err)로 전달', async () => {
    (articleRepo.findById as jest.Mock).mockResolvedValue({ id: 1, userId: 999 });

    const req = makeReq({ originalUrl: '/articles/1', params: { id: '1' }, user: { id: 1 } });
    const res = makeRes();

    await authorize(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(ForbiddenError);
  });

  test('users: userItem.id를 userId로 주입해서 비교한다', async () => {
    (userRepo.findById as jest.Mock).mockResolvedValue({ id: 7 });

    const req = makeReq({ originalUrl: '/users/7', params: { id: '7' }, user: { id: 7 } });
    const res = makeRes();

    await authorize(req, res, next);

    expect(userRepo.findById).toHaveBeenCalledWith(7);
    expect(next).toHaveBeenCalledWith();
  });

  test('products: productRepo만 호출한다 (분기 테스트)', async () => {
    (productRepo.findById as jest.Mock).mockResolvedValue({ id: 3, userId: 3 });

    const req = makeReq({ originalUrl: '/products/3', params: { id: '3' }, user: { id: 3 } });
    const res = makeRes();

    await authorize(req, res, next);

    expect(productRepo.findById).toHaveBeenCalledWith(3);
    expect(articleRepo.findById).not.toHaveBeenCalled();
    expect(userRepo.findById).not.toHaveBeenCalled();
    expect(commentRepo.findById).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith();
  });

  test('comments: commentRepo로 조회하고 권한 검사', async () => {
    (commentRepo.findById as jest.Mock).mockResolvedValue({ id: 10, userId: 10 });

    const req = makeReq({ originalUrl: '/comments/10', params: { id: '10' }, user: { id: 10 } });
    const res = makeRes();

    await authorize(req, res, next);

    expect(commentRepo.findById).toHaveBeenCalledWith(10);
    expect(next).toHaveBeenCalledWith();
  });

  test('알 수 없는 url이면 BadRequestError', async () => {
    const req = makeReq({ originalUrl: '/wtf/1' });
    const res = makeRes();

    await authorize(req, res, next);

    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(BadRequestError);
  });

  test('repo가 에러를 던지면 next(err)로 전달', async () => {
    (articleRepo.findById as jest.Mock).mockRejectedValue(new Error('db down'));

    const req = makeReq({ originalUrl: '/articles/1', params: { id: '1' }, user: { id: 1 } });
    const res = makeRes();

    await authorize(req, res, next);

    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('db down');
  });
});
