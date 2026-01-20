import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import likeService from '../service/likeService';
import ValidationError from '../lib/errors/ValidationError';

class LikeController {
  async toggleLike(req: AuthenticatedRequest<{ id: string }>, res: Response) {
    if (!req.user) {
      throw new ValidationError('로그인이 필요합니다.');
    }

    const userId = req.user.id;
    const targetId = Number(req.params.id);

    const result = await likeService.toggleLike(userId, targetId, req.baseUrl);

    res.status(200).send(result);
  }
}

export default new LikeController();
