import express from "express";
import { authenticate } from "../middlewares/authenticate";
import { asyncHandler } from "../middlewares/asyncHandler";
import {
  createArticle,
  getArticle,
  updateArticle,
  deleteArticle,
  createArticleComment,
  getMyArticle
} from "../controllers/article.control";
import { likeArticle, unlikeArticle, getMyLikedArticles } from "../controllers/like.control";

const articleRouter = express.Router();

articleRouter.get('/myArticle', asyncHandler(authenticate), asyncHandler(getMyArticle))
articleRouter.get("/liked", asyncHandler(authenticate), asyncHandler(getMyLikedArticles));

articleRouter.post("/", asyncHandler(authenticate), asyncHandler(createArticle));
articleRouter.get("/:id(\\d+)", asyncHandler(authenticate), asyncHandler(getArticle));
articleRouter.patch("/:id(\\d+)", asyncHandler(authenticate), asyncHandler(updateArticle));
articleRouter.delete("/:id(\\d+)", asyncHandler(authenticate), asyncHandler(deleteArticle));

articleRouter.post('/:id(\\d+)/comments', asyncHandler(authenticate), asyncHandler(createArticleComment))

articleRouter.post("/:id(\\d+)/like", asyncHandler(authenticate), asyncHandler(likeArticle));
articleRouter.delete("/:id(\\d+)/like", asyncHandler(authenticate), asyncHandler(unlikeArticle));

export default articleRouter;
