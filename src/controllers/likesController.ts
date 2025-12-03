import { likesService } from '../services/likesService';

export async function changeProductLike(req, res) {
  const { productId } = req.params;
  const userId = req.user.id;

  const result = await likesService.changeProductLike(productId, userId);

  res.status(200).json(result);
}

export async function changeArticleLike(req, res) {
  const { articleId } = req.params;
  const userId = req.user.id;

  const result = await likesService.changeArticleLike(articleId, userId);

  res.status(200).json(result);
}
