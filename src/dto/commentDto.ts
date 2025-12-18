export interface CommentCreateDto {
  content: string;
  productId?: string;
  articleId?: string;
  userId: string;
}

export interface CommentQueryDto {
  productId?: string;
  articleId?: string;
  cursor?: string;
  take?: number;
}

export interface CommentUpdateDto {
  content: string;
  userId: string;
}
