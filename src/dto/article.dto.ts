import { Prisma } from '@prisma/client';

//기사 생성 DTO

export type CreateArticleBodyDTO = {
  title: string;
  content: string;
  image: string | null;
};

//기사 수정 DTO

export type UpdateArticleDto = Prisma.ArticleUncheckedUpdateInput;

//기사 리스트 조회

export interface GetListArticleParam {
  page: number;
  pageSize: number;
  orderBy?: 'recent';
  keyword?: string;
}
