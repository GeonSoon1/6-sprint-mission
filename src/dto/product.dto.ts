import { Prisma } from '@prisma/client';

//상품 생성 DTO

export type CreateProductBodyDTO = {
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
};

//상품 수정 DTO

export type UpdateProductDto = Prisma.ProductUncheckedUpdateInput;

//상품 리스트 조회

export interface GetListProductParam {
  page: number;
  pageSize: number;
  orderBy?: 'recent';
  keyword?: string;
}
