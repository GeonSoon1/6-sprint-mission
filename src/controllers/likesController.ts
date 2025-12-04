import { likesService } from '../services/likesService';
import { RequestHandler } from 'express';

export const changeProductLike: RequestHandler = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  const result = await likesService.changeProductLike(productId, userId);

  res.status(200).json(result);
};

export const changeArticleLike: RequestHandler = async (req, res) => {
  const { articleId } = req.params;
  const userId = req.user.id;

  const result = await likesService.changeArticleLike(articleId, userId);

  res.status(200).json(result);
};
