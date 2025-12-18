export interface CreateUserDTO {
  email: string;
  nickname: string;
  password: string;
}

export interface UpdateUserDTO {
  email?: string;
  nickname?: string;
  password?: string;
  imageUrls?: string[];
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  tags: string[];
  userId: number;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
  imageUrls?: string[];
  userId?: number;
}

export interface CreateArticleDTO {
  title: string;
  content: string;
  userId: number;
}

export interface UpdateArticleDTO {
  title?: string;
  content?: string;
  imageUrls?: string[];
  userId?: number;
}

interface BaseComment {
  content: string;
  userId: number;
}

interface ArticleComment extends BaseComment {
  articleId: number;
  productId: null;
}

interface ProductComment extends BaseComment {
  articleId: null;
  productId: number;
}

export type CreateCommentDTO = ArticleComment | ProductComment;

export interface UpdateCommentDTO {
  content?: string;
  userId?: number;
  productId?: number;
  articleId?: number;
}
