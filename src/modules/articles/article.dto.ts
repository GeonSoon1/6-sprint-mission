export interface ArticleCreateDto {
  title: string;
  content: string;
  userId: string;
}

export interface ArticleQueryDto {
  page: number;
  limit: number;
  search: string;
  sort: 'recent' | 'oldest';
  userId: string | null;
}

export interface ArticleUpdateDto {
  title?: string;
  content?: string;
  userId: string;
}
