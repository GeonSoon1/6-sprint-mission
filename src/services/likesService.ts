import { likesRepository } from '../repositories/likesRepository';
import { productsRepository } from '../repositories/productsRepository';
import { articlesRepository } from '../repositories/articlesRepository';

interface LikeResponse {
  isLiked: boolean;
  message: string;
}

const changeProductLike = async (productId: string, userId: string): Promise<LikeResponse> => {
  await productsRepository.findProductById(productId);

  const likeCheck = await likesRepository.findProductLike(userId, productId);

  if (likeCheck) {
    await likesRepository.deleteProductLike(likeCheck.id);
    return { isLiked: false, message: '좋아요를 취소했습니다.' };
  } else {
    await likesRepository.createProductLike(userId, productId);
    return { isLiked: true, message: '좋아요를 눌렀습니다.' };
  }
};

const changeArticleLike = async (articleId: string, userId: string): Promise<LikeResponse> => {
  await articlesRepository.findArticleById(articleId);

  const likeCheck = await likesRepository.findArticleLike(userId, articleId);

  if (likeCheck) {
    await likesRepository.deleteArticleLike(likeCheck.id);
    return { isLiked: false, message: '좋아요를 취소했습니다.' };
  } else {
    await likesRepository.createArticleLike(userId, articleId);
    return { isLiked: true, message: '좋아요를 눌렀습니다.' };
  }
};

export const likesService = {
  changeProductLike,
  changeArticleLike,
};
