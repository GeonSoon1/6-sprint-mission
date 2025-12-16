import type { Request, Response } from 'express';
import { LikeService } from '../services';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types/di';

@injectable()
export class LikeController {
  constructor(@inject(TYPES.LikeService) private readonly likeService: LikeService) {}

  // 상품 좋아요 토글
  public toggleProductLike = async (req: Request, res: Response) => {
    const { id: productId } = req.params;
    const userId = req.user!.id;

    const result = await this.likeService.toggleProductLike(userId, productId);
    res.status(200).json(result);
  };

  public toggleArticleLike = async (req: Request, res: Response) => {
    const { id: articleId } = req.params;
    const userId = req.user!.id;

    const result = await this.likeService.toggleArticleLike(userId, articleId);
    res.status(200).json(result);
  };
}
