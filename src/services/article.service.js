import * as ArticleRepo from "../repositories/article.repo";
import NotFoundError from "../errors/NotFoundError";
import UnauthorizedError from "../errors/UnauthorizedError";
import * as userRepo from '../repositories/user.repo'

export async function createArticle(data, user) {
  const article = await ArticleRepo.createArticle(data, user);
  return article;
}

export async function getArticle(id) {
  const existingArticle = await ArticleRepo.getArticleById(id);
  if (!existingArticle) {
    throw new NotFoundError("기사를 찾을 수 없습니다.");
  }
  return existingArticle;
}

export async function updateArticle(id, data, user) {
  const existingArticle = await ArticleRepo.getArticleById(id);
  if (!existingArticle) {
    throw new NotFoundError("기사를 찾을 수 없습니다.");
  }
  if (existingArticle.userId !== user.id) {
    throw new UnauthorizedError("기사를 수정 할 권한이 없습니다.");
  }
  const updated = await ArticleRepo.updateArticle(id, data);
  return updated;
}

export async function deleteArticle(id, user) {
  const existingArticle = await ArticleRepo.getArticleById(id);
  if (!existingArticle) {
    throw new NotFoundError("기사를 찾을 수 없습니다.");
  }
  if (existingArticle.userId !== user.id) {
    throw new UnauthorizedError("기사를 삭제 할 권한이 없습니다.");
  }
  return await ArticleRepo.deleteArticle(id);
}

export async function getMyArticle(user) {
  const existingUser = await userRepo.getUserById(user.id)
  if (!existingUser) {
    throw new NotFoundError('유저를 찾을 수 없습니다.')
  }
  const article = await ArticleRepo.getMyArticle(existingUser.id)
  return article
}
