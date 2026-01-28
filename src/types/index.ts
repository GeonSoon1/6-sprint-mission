import { User, Product, Article, Comment, Favorite, Like } from '@prisma/client';

// User types
export type UserWithoutPassword = Omit<User, 'password'>;

// Product types
export interface ProductWithUser extends Product {
  user: User;
}

export interface ProductWithFavorites extends Product {
  favorites: Favorite[];
  _count?: {
    favorites: number;
  };
}

// Article types
export interface ArticleWithUser extends Article {
  user: User;
}

export interface ArticleWithLikes extends Article {
  likes: Like[];
  _count?: {
    likes: number;
  };
}

// Comment types
export interface CommentWithUser extends Comment {
  user: User;
}

export interface CommentWithRelations extends Comment {
  user: User;
  product?: Product | null;
  article?: Article | null;
}

// Auth types
export interface TokenPayload {
  id: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// Request/Response types
export interface RegisterBody {
  email: string;
  nickname: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

// Pagination types
export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

// Error types
export interface ErrorResponse {
  message: string;
  statusCode?: number;
}

// Re-export DTOs
export * from './dto';

