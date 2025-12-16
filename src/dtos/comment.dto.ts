export interface CreateCommentDto {
  content: string;
}

export interface UpdateCommentDto {
  content: string;
}

export interface CommentResponseDto {
  id: number;
  content: string;
  createdAt: Date;
  userId: number;
  user?: {
    id: number;
    nickname: string;
  };
}
