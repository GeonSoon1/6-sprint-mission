import type { Article, ArticleLike } from '@prisma/client';
import { HttpError } from '../lib/httpError';

import {
  findArticlesWithLikes,
  findArticleByIdWithLikes,
  findArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  findMyArticles,
  findArticleLike,
  deleteArticleLike,
  createArticleLike,
  countArticleLikes,
} from '../repositories/articleRepository';

import { verifyAccessToken } from '../lib/token';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants';

export type CreateArticleDto = { title: string; content: string };
export type UpdateArticleDto = { title?: string; content?: string };
export type CookieBag = Record<string, string> | undefined;

type ArticleWithLikes = Article & { likes: ArticleLike[] };

function getOptionalUserId(cookies: CookieBag): string | null {
  try {
    const token = cookies?.[ACCESS_TOKEN_COOKIE_NAME];
    if (!token) return null;

    const decoded = verifyAccessToken(token) as { id: string };
    return decoded.id || null;
  } catch {
    return null;
  }
}

function mapWithLike(article: ArticleWithLikes, userId: string | null) {
  const likeCount = article.likes.length;
  const isLiked = userId
    ? article.likes.some((l) => l.userId === userId)
    : false;
  const { likes, ...rest } = article;
  return { ...rest, likeCount, isLiked };
}

export async function getArticlesService(cookies: CookieBag) {
  const userId = getOptionalUserId(cookies);

  // repo가 include: { likes: true } 이므로 실제로 likes가 붙어서 옴
  const articles = (await findArticlesWithLikes()) as ArticleWithLikes[];
  return articles.map((a) => mapWithLike(a, userId));
}

export async function getArticleByIdService(id: string, cookies: CookieBag) {
  const userId = getOptionalUserId(cookies);
  const article = (await findArticleByIdWithLikes(
    id
  )) as ArticleWithLikes | null;

  if (!article) throw new HttpError(404, '게시글을 찾을 수 없습니다.');
  return mapWithLike(article, userId);
}

export async function createArticleService(
  data: CreateArticleDto,
  userId: string
) {
  return createArticle({ ...data, userId });
}

export async function getMyArticlesService(userId: string) {
  return findMyArticles(userId);
}

export async function updateArticleService(
  id: string,
  data: UpdateArticleDto,
  userId: string
) {
  const article = await findArticleById(id);
  if (!article) throw new HttpError(404, '게시글을 찾을 수 없습니다.');
  if (article.userId !== userId)
    throw new HttpError(403, '게시글을 수정할 권한이 없습니다.');

  return updateArticle(id, data);
}

export async function deleteArticleService(id: string, userId: string) {
  const article = await findArticleById(id);
  if (!article) throw new HttpError(404, '게시글을 찾을 수 없습니다.');
  if (article.userId !== userId)
    throw new HttpError(403, '게시글을 삭제할 권한이 없습니다.');

  await deleteArticle(id);
}

export async function toggleArticleLikeService(
  articleId: string,
  userId: string
) {
  const article = await findArticleById(articleId);
  if (!article) throw new HttpError(404, '게시글을 찾을 수 없습니다.');

  const existing = await findArticleLike(userId, articleId);

  if (existing) await deleteArticleLike(existing.id);
  else await createArticleLike(userId, articleId);

  const likeCount = await countArticleLikes(articleId);
  return { isLiked: !existing, likeCount };
}
