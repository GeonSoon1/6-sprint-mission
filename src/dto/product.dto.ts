import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  IsArray,
  IsUUID,
} from 'class-validator';
import { Category, ProductStatus, Product } from '@prisma/client';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty({ message: '상품 이름은 필수 항목입니다.' })
  name!: Product['name'];

  @IsString()
  @IsOptional()
  description?: Product['description'];

  @IsEnum(Category)
  @IsNotEmpty({ message: '카테고리는 필수 항목입니다.' })
  category!: Product['category'];

  @IsNumber()
  @IsNotEmpty({ message: '가격을 입력해주세요.' })
  price!: Product['price'];

  @IsNumber()
  @IsNotEmpty({ message: '상품 갯수를 입력해주세요.' })
  stock!: Product['stock'];

  @IsEnum(ProductStatus)
  @IsNotEmpty()
  status!: Product['status'];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}

export class ProductIdParamDTO {
  @IsUUID('4', { message: '유효하지 않은 상품 ID 입니다.' })
  @IsNotEmpty({ message: '상품 ID는 필수 항목입니다.' })
  id!: Product['id'];
}

export class UpdateProductDTO {
  @IsString()
  @IsNotEmpty({ message: '상품 이름은 필수 항목입니다.' })
  @IsOptional()
  name!: Product['name'];

  @IsString()
  @IsOptional()
  description?: Product['description'];

  @IsEnum(Category)
  @IsNotEmpty({ message: '카테고리는 필수 항목입니다.' })
  @IsOptional()
  category!: Product['category'];

  @IsNumber()
  @IsNotEmpty({ message: '가격을 입력해주세요.' })
  @IsOptional()
  price!: Product['price'];

  @IsNumber()
  @IsNotEmpty({ message: '상품 갯수를 입력해주세요.' })
  @IsOptional()
  stock!: Product['stock'];

  @IsEnum(ProductStatus)
  @IsNotEmpty()
  @IsOptional()
  status!: Product['status'];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
