import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from '../structs/articlesStructs';
import { Request, Response } from 'express';
import { articleService } from '../service/articleService';

export async function createArticle(req: Request, res: Response) {
  const data = create(req.body, CreateArticleBodyStruct);
  const result = await articleService.createArticle(data, req.user);

  return res.status(201).send({ message: 'article 생성됨', result });
}

export async function getArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const result = await articleService.getArticle(id, req.user);

  return res.send({ article: result.article, isLike: Boolean(result.isLike) });
}

export async function updateArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);
  const result = await articleService.updateArticle(id, data, req.user);

  return res.send({ message: 'article 수정됨', result });
}

export async function deleteArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const result = await articleService.deleteArticle(id, req.user);

  return res.status(204).send({ message: 'article 삭제됨', article: result });
}

export async function getArticleList(req: Request, res: Response) {
  const params = create(req.query, GetArticleListParamsStruct);
  const result = await articleService.getListArticle(params);

  return res.send(result);
}

//좋아요

export async function likeArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const result = await articleService.likeArticle(id, req.user);

  return res.status(200).send({ message: 'Like!', result });
}

export async function dislikeArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const result = await articleService.dislikeArticle(id, req.user);

  return res.status(200).send({ message: 'Dislike!', result });
}
