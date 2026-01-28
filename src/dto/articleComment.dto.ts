import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';
import { ArticleComment } from '@prisma/client';

export class CreateArticleCommentDTO {
  @IsString()
  @IsNotEmpty({ message: '댓글 내용을 입력해주세요.' })
  content!: ArticleComment['content'];
}

export class UpdateArticleCommentDTO {
  @IsUUID(4, { message: '유효하지 않은 댓글 ID 형식입니다.' })
  @IsNotEmpty({ message: '유효하지 않은 댓글 ID입니다.' })
  commentId!: ArticleComment['id'];

  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: '댓글 내용을 입력해주세요.' })
  content!: ArticleComment['content'];
}

export class ArticleCommentParamDTO {
  @IsUUID(4, { message: '유효하지 않은 게시글 ID 형식입니다.' })
  @IsNotEmpty({ message: '유효하지 않은 게시글 ID입니다.' })
  articleId!: ArticleComment['articleId'];
}
