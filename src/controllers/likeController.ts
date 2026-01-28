import type { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { LikeService } from '@services';
import { TYPES } from '@types';

@injectable()
export class LikeController {
  constructor(@inject(TYPES.LikeService) private readonly likeService: LikeService) {}

  // 상품 좋아요 토글
  toggleProductLike = async (req: Request, res: Response) => {
    const { id: productId } = req.params;
    const userId = req.user!.id;

    const result = await this.likeService.toggleProductLike(userId, productId);
    res.status(200).json(result);
  };

  toggleArticleLike = async (req: Request, res: Response) => {
    const { id: articleId } = req.params;
    const userId = req.user!.id;

    const result = await this.likeService.toggleArticleLike(userId, articleId);
    res.status(200).json(result);
  };
}
