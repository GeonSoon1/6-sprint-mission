import * as favoritesRepository from '../repositories/favoritesRepository';
import * as productsRepository from '../repositories/productsRepository';
import * as usersRepository from '../repositories/usersRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import BadRequestError from '../lib/errors/BadRequestError';

export async function createFavorite(productId: number, userId: number) {
  const userExists = await usersRepository.userExists(userId);
  if (!userExists) {
    throw new NotFoundError('user', userId);
  }

  const existingProduct = await productsRepository.getProduct(productId);
  if (!existingProduct) {
    throw new NotFoundError('product', productId);
  }

  const existingFavorite = await favoritesRepository.getFavorite(productId, userId);
  if (existingFavorite) {
    throw new BadRequestError('Already favorited');
  }

  await favoritesRepository.createFavorite({ productId, userId });
}

export async function deleteFavorite(productId: number, userId: number) {
  const userExists = await usersRepository.userExists(userId);
  if (!userExists) {
    throw new NotFoundError('user', userId);
  }

  const existingProduct = await productsRepository.getProduct(productId);
  if (!existingProduct) {
    throw new NotFoundError('product', productId);
  }

  const existingFavorite = await favoritesRepository.getFavorite(productId, userId);
  if (!existingFavorite) {
    throw new BadRequestError('Not favorited');
  }

  await favoritesRepository.deleteFavorite(existingFavorite.id);
}
