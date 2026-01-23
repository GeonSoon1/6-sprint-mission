import * as productsService from '../../src/services/productsService.js';
import * as productsRepository from '../../src/repositories/productsRepository.js';
import * as notificationsService from '../../src/services/notificationsService.js';

describe('ProductService.updateProduct', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('throws when product is missing', async () => {
    jest.spyOn(productsRepository, 'getProduct').mockResolvedValue(null);

    await expect(productsService.updateProduct(1, { userId: 1, price: 10 })).rejects.toThrow(
      'product with id 1 not found',
    );
  });

  it('sends notifications when price changes', async () => {
    jest.spyOn(productsRepository, 'getProduct').mockResolvedValue({
      id: 1,
      name: 'Product',
      price: 100,
      userId: 1,
      favorites: [{ userId: 2 } as never, { userId: 3 } as never],
    } as never);
    jest.spyOn(productsRepository, 'updateProductWithFavorites').mockResolvedValue({
      id: 1,
      name: 'Product',
      price: 200,
      userId: 1,
      favoriteCount: 2,
      isFavorited: false,
      tags: [],
      images: [],
      description: 'Desc',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);
    const notifySpy = jest
      .spyOn(notificationsService, 'notifyPriceChange')
      .mockResolvedValue();

    await productsService.updateProduct(1, { userId: 1, price: 200 });

    expect(notifySpy).toHaveBeenCalledWith([2, 3], 1, 'Product', 100, 200);
  });

  it('does not send notifications when price is unchanged', async () => {
    jest.spyOn(productsRepository, 'getProduct').mockResolvedValue({
      id: 1,
      name: 'Product',
      price: 100,
      userId: 1,
      favorites: [{ userId: 2 } as never],
    } as never);
    jest.spyOn(productsRepository, 'updateProductWithFavorites').mockResolvedValue({
      id: 1,
      name: 'Product',
      price: 100,
      userId: 1,
      favoriteCount: 1,
      isFavorited: false,
      tags: [],
      images: [],
      description: 'Desc',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);
    const notifySpy = jest
      .spyOn(notificationsService, 'notifyPriceChange')
      .mockResolvedValue();

    await productsService.updateProduct(1, { userId: 1, price: 100 });

    expect(notifySpy).not.toHaveBeenCalled();
  });
});
