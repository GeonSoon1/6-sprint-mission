import { ArticleCustom } from '../types/express/body.types';
import { Request, Response } from 'express';
import prisma from '../lib/prismaclient';
import {
  CreateArticleRequestDto,
  CreateArticleCommandDto,
  GetArticlesRequestDto,
  GetArticlesFinalRequestDto,
  UpdateArticleDto,
} from '../dto/article.dto';
import { articleRepository } from '../repository/article.repository';
import { OrderType, OrderByMap } from '../types/express/common.types';

export const articleService = {
  async createArticle(data: CreateArticleRequestDto, userId: number) {
    // 비즈니스 검증
    if (!data.title || !data.content) {
      throw new Error('게시글 제목 또는 내용이 없습니다');
    }

    if (!userId) {
      throw new Error('유효한 사용자가 아닙니다');
    }

    const createData: CreateArticleCommandDto = {
      userId,
      title: data.title,
      content: data.content,
    };

    return articleRepository.create(createData);
  },

  async readArticles(query: GetArticlesRequestDto) {
    // 비지니스 처리 & 검증
    // offset & limit : 숫자 변환 + 검증
    const offset = Number(query.offset ?? 0);
    const limit = Number(query.limit ?? 10);

    // orderBy : 출력 순서 검증
    const order = String(query.order ?? OrderType.NEWEST);
    const orderTypeChange = order as OrderType;

    const orderBy = OrderByMap[orderTypeChange];

    // article - title & content : 문자 검증
    const title = String(query.title ?? '');
    const content = String(query.content ?? '');

    const querySet: GetArticlesFinalRequestDto = {
      offset,
      limit,
      orderBy,
      title,
      content,
    };

    return articleRepository.readList(querySet);
  },

  async readArticle(paramId: string) {
    const articleId = Number(paramId);
    if (!articleId || Number.isNaN(articleId))
      throw new Error('유효한 게시글 ID가 아닙니다');

    return articleRepository.readInfo(articleId);
  },

  async readArticleLike(paramId: string, userId: number) {
    const articleId = Number(paramId);
    if (!articleId || Number.isNaN(articleId))
      throw new Error('유효한 게시글 ID가 아닙니다');

    if (!userId) throw new Error('유효한 사용자가 아닙니다');

    const checkLiked = await articleRepository.readLike(articleId, userId);

    return Boolean(checkLiked);
  },

  async updateArticle(
    body: UpdateArticleDto,
    articleId: string,
    userId: number
  ) {
    const id = Number(articleId);
    if (!id || Number.isNaN(id)) throw new Error('유효한 게시글 ID가 아닙니다');

    const article = await articleRepository.readInfo(id);

    if (article.userId !== userId) {
      throw new Error('수정 권한이 없습니다');
    }

    return articleRepository.update(body, id);
  },

  async deleteArticle(articleId: string, userId: number) {
    const id = Number(articleId);
    if (!id || Number.isNaN(id)) throw new Error('유효한 게시글 ID가 아닙니다');
    const article = await articleRepository.readInfo(id);

    if (article.userId !== userId) {
      throw new Error('삭제 권한이 없습니다');
    }

    return articleRepository.delete(id);
  },
};
