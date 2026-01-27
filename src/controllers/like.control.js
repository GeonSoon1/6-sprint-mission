import { create } from "superstruct";
import { IdParamsStruct } from "../structs/common.struct.js"; 
import * as likeService from "../services/like.service.js";
import { Request, Response } from "express";

export async function likeProduct(req, res) {
  const { id: productId } = create(req.params, IdParamsStruct);
  await likeService.likeProduct(productId, req.user.id);
  return res.sendStatus(204);
}

export async function unlikeProduct(req, res) {
  const { id: productId } = create(req.params, IdParamsStruct);
  await likeService.unlikeProduct(productId, req.user.id);
  return res.sendStatus(204);
}

export async function likeArticle(req, res) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  await likeService.likeArticle(articleId, req.user.id);
  return res.sendStatus(204);
}

export async function unlikeArticle(req, res) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  await likeService.unlikeArticle(articleId, req.user.id);
  return res.sendStatus(204);
}

export async function getMyLikedProducts(req, res) {
  const products = await likeService.getMyLikedProducts(req.user.id);
  return res.json(products);
}

export async function getMyLikedArticles(req, res) {
  const articles = await likeService.getMyLikedArticles(req.user.id);
  return res.json(articles);
}