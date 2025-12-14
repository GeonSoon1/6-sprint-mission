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

export type CreateArticleDto = {
  title: string;
  content: string;
};

export type UpdateArticleDto = {
  title?: string;
  content?: string;
};

export type CookieBag = Record<string, string> | undefined;

function getOptionalUserId(cookies: CookieBag): string | null {
  try {
    const token = cookies?.[ACCESS_TOKEN_COOKIE_NAME];
    if (!token) return null;

    const decoded = verifyAccessToken(token);
    const userId = String((decoded as any).id);
    return userId || null;
  } catch {
    return null;
  }
}

type LikeRow = { userId: string };
type ArticleWithLikes = { likes: LikeRow[]; [key: string]: any };

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
  const articles = await findArticlesWithLikes();
  return articles.map((a: any) => mapWithLike(a, userId));
}

export async function getArticleByIdService(id: string, cookies: CookieBag) {
  const userId = getOptionalUserId(cookies);
  const article = await findArticleByIdWithLikes(id);

  if (!article) {
    const e: any = new Error('게시글을 찾을 수 없습니다.');
    e.status = 404;
    throw e;
  }

  return mapWithLike(article as any, userId);
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

  if (!article) {
    const e: any = new Error('게시글을 찾을 수 없습니다.');
    e.status = 404;
    throw e;
  }

  if (article.userId !== userId) {
    const e: any = new Error('게시글을 수정할 권한이 없습니다.');
    e.status = 403;
    throw e;
  }

  return updateArticle(id, data);
}

export async function deleteArticleService(id: string, userId: string) {
  const article = await findArticleById(id);

  if (!article) {
    const e: any = new Error('게시글을 찾을 수 없습니다.');
    e.status = 404;
    throw e;
  }

  if (article.userId !== userId) {
    const e: any = new Error('게시글을 삭제할 권한이 없습니다.');
    e.status = 403;
    throw e;
  }

  await deleteArticle(id);
}

export async function toggleArticleLikeService(
  articleId: string,
  userId: string
) {
  const article = await findArticleById(articleId);

  if (!article) {
    const e: any = new Error('게시글을 찾을 수 없습니다.');
    e.status = 404;
    throw e;
  }

  const existing = await findArticleLike(userId, articleId);

  if (existing) {
    await deleteArticleLike(existing.id);
  } else {
    await createArticleLike(userId, articleId);
  }

  const likeCount = await countArticleLikes(articleId);

  return {
    isLiked: !existing,
    likeCount,
  };
}
