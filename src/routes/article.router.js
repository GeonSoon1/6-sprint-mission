import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import {
  createArticle,
  getArticle,
  updateArticle,
  deleteArticle,
  createArticleComment,
  getMyArticle
} from "../controllers/article.controller.js";
import { likeArticle, unlikeArticle, getMyLikedArticles } from "../controllers/like.controller.js";

const articleRouter = express.Router();

articleRouter.get('/myArticle', asyncHandler(authenticate), asyncHandler(getMyArticle))
articleRouter.get("/liked", asyncHandler(authenticate), asyncHandler(getMyLikedArticles));

articleRouter.post("/", asyncHandler(authenticate), asyncHandler(createArticle));
// articleRouter.get("/:id(\\d+)", asyncHandler(authenticate), asyncHandler(getArticle));
articleRouter.patch("/:id(\\d+)", asyncHandler(authenticate), asyncHandler(updateArticle));
articleRouter.delete("/:id(\\d+)", asyncHandler(authenticate), asyncHandler(deleteArticle));

// 단건 조회는 비로그인도 가능
articleRouter.get("/:id(\\d+)", asyncHandler(getArticle));

// 댓글/좋아요는 로그인 필요
articleRouter.post('/:id(\\d+)/comments', asyncHandler(authenticate), asyncHandler(createArticleComment))

articleRouter.post("/:id(\\d+)/like", asyncHandler(authenticate), asyncHandler(likeArticle));
articleRouter.delete("/:id(\\d+)/like", asyncHandler(authenticate), asyncHandler(unlikeArticle));

export default articleRouter;
