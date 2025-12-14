import { Prisma } from '@prisma/client';

//댓글 생성 DTO

export type CreateCommentBodyDTO = {
  title: string;
  content: string;
  images: string[];
};

//댓글 수정 DTO

export type UpdateCommentDto = Prisma.CommentUncheckedUpdateInput;
