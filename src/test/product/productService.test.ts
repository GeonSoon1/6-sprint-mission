import productService from '../../service/productService';
import productRepository from '../../repository/productRepository';
import notificationService from '../../service/notificationService';
import { notifyUser } from '../../socket/socketServer';
import ForbiddenError from '../../lib/errors/ForbiddenError';
import NotFoundError from '../../lib/errors/NotFoundError';

jest.mock('../../repository/productRepository', () => ({
  findMany: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findWatchers: jest.fn(),
}));

jest.mock('../../service/notificationService', () => ({
  notifyPriceChanged: jest.fn(),
}));

jest.mock('../../socket/socketServer', () => ({
  notifyUser: jest.fn(),
}));

describe('ProductService.updateProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('가격이 변경되면 관심 유저에게 알림을 보낸다', async () => {
    (productRepository.findById as jest.Mock).mockResolvedValue({
      id: 1,
      userId: 10,
      price: 100,
    });

    (productRepository.update as jest.Mock).mockResolvedValue({
      id: 1,
      price: 150,
    });

    (productRepository.findWatchers as jest.Mock).mockResolvedValue([20, 30]);

    (notificationService.notifyPriceChanged as jest.Mock).mockResolvedValue({
      id: 999,
      type: 'PRICE_CHANGED',
    });

    await productService.updateProduct(1, { price: 150 }, 10);

    expect(productRepository.update).toHaveBeenCalled();

    expect(notificationService.notifyPriceChanged).toHaveBeenCalledTimes(2);
    expect(notifyUser).toHaveBeenCalledTimes(2);
  });

  test('가격이 변경되지 않으면 알림을 보내지 않는다', async () => {
    (productRepository.findById as jest.Mock).mockResolvedValue({
      id: 1,
      userId: 10,
      price: 100,
    });

    (productRepository.update as jest.Mock).mockResolvedValue({
      id: 1,
      price: 100,
    });

    await productService.updateProduct(1, { price: 100 }, 10);

    expect(notificationService.notifyPriceChanged).not.toHaveBeenCalled();
    expect(notifyUser).not.toHaveBeenCalled();
  });

  test('상품이 없으면 NotFoundError를 던진다', async () => {
    (productRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(productService.updateProduct(999, { price: 200 }, 10)).rejects.toThrow(
      NotFoundError,
    );
  });

  test('본인 상품이 아니면 ForbiddenError를 던진다', async () => {
    (productRepository.findById as jest.Mock).mockResolvedValue({
      id: 1,
      userId: 99,
      price: 100,
    });

    await expect(productService.updateProduct(1, { price: 200 }, 10)).rejects.toThrow(
      ForbiddenError,
    );
  });
});

describe('ProductService.deleteProduct', () => {
  test('본인 상품이면 삭제한다', async () => {
    (productRepository.findById as jest.Mock).mockResolvedValue({
      id: 1,
      userId: 10,
    });

    await productService.deleteProduct(1, 10);

    expect(productRepository.delete).toHaveBeenCalledWith(1);
  });

  test('본인 상품이 아니면 ForbiddenError', async () => {
    (productRepository.findById as jest.Mock).mockResolvedValue({
      id: 1,
      userId: 99,
    });

    await expect(productService.deleteProduct(1, 10)).rejects.toThrow(ForbiddenError);
  });
});

test('유효하지 않은 카테고리면 에러를 던진다', async () => {
  await expect(
    productService.createProduct({ name: 'test', category: 'INVALID' }, 1),
  ).rejects.toThrow(ForbiddenError);
});
