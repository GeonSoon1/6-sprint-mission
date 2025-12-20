export interface CreateArticleDto {
  title: string;
  content: string;
}

export interface UpdateArticleDto {
  title?: string;
  content?: string;
}

export interface ArticleResponseDto {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  user?: {
    id: number;
    nickname: string;
  };
  isLiked?: boolean;
  likeCount?: number;
}
