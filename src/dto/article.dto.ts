import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';
import { Article } from '@prisma/client';

export class CreateArticleDTO {
  @IsString()
  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  title!: Article['title'];

  @IsString()
  @IsNotEmpty({ message: '내용을 입력해주세요.' })
  content!: Article['content'];
}

export class UpdateArticleDTO {
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  title!: Article['title'];

  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: '내용을 입력해주세요.' })
  content!: Article['content'];
}

export class ArticleIdParamDTO {
  @IsNotEmpty({ message: '게시글 ID는 필수 항목입니다.' })
  @IsUUID('4', { message: '유효하지 않은 게시글 ID 입니다.' })
  id!: Article['id'];
}
