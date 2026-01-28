import { Router } from 'express';
import { asyncHandler, isLoggedIn, validator, pagination } from '@middlewares';
import { CreateArticleDTO, UpdateArticleDTO, ArticleIdParamDTO } from '@dto';
import { ArticleController, LikeController } from '@controllers';

import { container } from '../lib/inversify.config';
import { TYPES } from '../types/di';

const articleController = container.get<ArticleController>(TYPES.ArticleController);
const likeController = container.get<LikeController>(TYPES.LikeController);

const router = Router();

router
  .route('/')
  .post(
    isLoggedIn,
    validator({ body: CreateArticleDTO }),
    asyncHandler(articleController.createArticle), // 게시글 생성
  )
  .get(pagination, asyncHandler(articleController.getArticles)); // 게시글 목록

router
  .route('/:id')
  .patch(
    isLoggedIn,
    validator({ body: UpdateArticleDTO, params: ArticleIdParamDTO }),
    asyncHandler(articleController.updateArticle), //게시글 수정
  )
  .get(
    validator({ params: ArticleIdParamDTO }),
    asyncHandler(articleController.getArticleById), // 게시글 ID로 가져오기
  )
  .delete(
    isLoggedIn,
    validator({ params: ArticleIdParamDTO }),
    asyncHandler(articleController.deleteArticle), // 게시글 삭제
  );

router.route('/:id/like').post(
  isLoggedIn,
  validator({ params: ArticleIdParamDTO }),
  asyncHandler(likeController.toggleArticleLike), //게시글 좋아요 토글
);

export default router;
