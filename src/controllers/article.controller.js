import { create } from "superstruct";
import * as ArticleServices from "../services/article.service.js";
import * as commentServices from '../services/comment.service.js'
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
} from "../structs/article.struct.js";
import { IdParamsStruct } from "../structs/common.struct.js";
import { CreateCommentBodyStruct } from '../structs/comment.struct.js'

export async function createArticle(req, res) {
  const data = create(req.body, CreateArticleBodyStruct);
  const article = await ArticleServices.createArticle(data, req.user);
  return res.json(article);
}

export async function getArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const article = await ArticleServices.getArticle(id);
  return res.json(article);
}

export async function updateArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);
  const updated = await ArticleServices.updateArticle(id, data, req.user);
  return await res.json(updated);
}

export async function deleteArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  await ArticleServices.deleteArticle(id, req.user);
  return res.sendStatus(204);
}

// 댓글 생성
export async function createArticleComment(req, res) {
  const { id: articleId } = create(req.params, IdParamsStruct)
  const data = create(req.body, CreateCommentBodyStruct)
  const comment = await commentServices.createComment(
    {
      content: data.content,
      productId: null,
      articleId,
    },
    req.user
  )
  return res.json(comment)
}

// 게시글 조회
export async function getMyArticle(req, res) {
  const article = await ArticleServices.getMyArticle(req.user)
  return res.json(article)
}
