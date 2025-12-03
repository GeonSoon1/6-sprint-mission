import { User, Product, Article, Comment, Favorite, Like } from '@prisma/client';
export type UserWithoutPassword = Omit<User, 'password'>;
export interface ProductWithUser extends Product {
    user: User;
}
export interface ProductWithFavorites extends Product {
    favorites: Favorite[];
    _count?: {
        favorites: number;
    };
}
export interface ArticleWithUser extends Article {
    user: User;
}
export interface ArticleWithLikes extends Article {
    likes: Like[];
    _count?: {
        likes: number;
    };
}
export interface CommentWithUser extends Comment {
    user: User;
}
export interface CommentWithRelations extends Comment {
    user: User;
    product?: Product | null;
    article?: Article | null;
}
export interface TokenPayload {
    id: number;
}
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export interface RegisterBody {
    email: string;
    nickname: string;
    password: string;
}
export interface LoginBody {
    email: string;
    password: string;
}
export interface PaginationQuery {
    page?: string;
    limit?: string;
}
export interface PaginationParams {
    page: number;
    limit: number;
    skip: number;
}
export interface ErrorResponse {
    message: string;
    statusCode?: number;
}
export * from './dto.js';
//# sourceMappingURL=index.d.ts.map