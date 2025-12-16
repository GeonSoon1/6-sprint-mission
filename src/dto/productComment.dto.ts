import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Product, ProductComment } from '@prisma/client';

export class CreateProductCommentParamDTO {
  @IsUUID(4, { message: '유효하지 않은 상품 ID 형식입니다.' })
  @IsNotEmpty({ message: '유효하지 않은 상품 ID입니다.' })
  productId!: Product['id'];

  @IsString()
  @IsNotEmpty({ message: '댓글 내용을 입력해주세요.' })
  content!: ProductComment['content'];
}

export class UpdateProductCommentParamDTO {
  @IsUUID(4, { message: '유효하지 않은 댓글 ID 형식입니다.' })
  @IsNotEmpty({ message: '유효하지 않은 댓글 ID입니다.' })
  id!: ProductComment['id'];

  @IsUUID(4, { message: '유효하지 않은 상품 ID 형식입니다.' })
  @IsNotEmpty({ message: '유효하지 않은 상품 ID입니다.' })
  productId!: Product['id'];

  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: '댓글 내용을 입력해주세요.' })
  content!: ProductComment['content'];
}
