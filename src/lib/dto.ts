import type { User, Category, ProductStatus } from '@prisma/client';

export class SignUpDTO {
  email!: User['email'];
  password!: User['password'];
  nickname!: User['nickname'];
  address?: User['address'];
}

export class LoginDTO {
  email!: User['email'];
  password!: User['password'];
}

export class CreateProductDTO {
  name!: string;
  description!: string;
  category!: Category;
  price!: number;
  stock!: number;
  status!: ProductStatus;
  tags?: string[];
  images?: string[];
}

export class CreateArticleDTO {
  title!: string;
  content!: string;
}
