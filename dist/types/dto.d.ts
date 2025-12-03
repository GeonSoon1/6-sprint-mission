import { Product, Article, Comment } from '@prisma/client';
export interface CreateUserDTO {
    email: string;
    nickname: string;
    password: string;
}
export interface UpdateUserDTO {
    email?: string;
    nickname?: string;
    image?: string | null;
}
export interface UpdatePasswordDTO {
    password: string;
    newPassword: string;
}
export interface CreateProductDTO {
    name: string;
    description: string;
    price: number;
    tags: string[];
    images: string[];
}
export interface UpdateProductDTO {
    name?: string;
    description?: string;
    price?: number;
    tags?: string[];
    images?: string[];
}
export interface ProductListQueryDTO {
    page: number;
    pageSize: number;
    orderBy?: 'recent';
    keyword?: string;
}
export interface ProductResponseDTO extends Product {
    favoriteCount: number;
    isFavorited?: boolean;
}
export interface CreateArticleDTO {
    title: string;
    content: string;
    image?: string | null;
}
export interface UpdateArticleDTO {
    title?: string;
    content?: string;
    image?: string | null;
}
export interface ArticleListQueryDTO {
    page: number;
    pageSize: number;
    orderBy?: 'recent';
    keyword?: string;
}
export interface ArticleResponseDTO extends Article {
    likeCount: number;
    isLiked?: boolean;
}
export interface CreateCommentDTO {
    content: string;
}
export interface UpdateCommentDTO {
    content?: string;
}
export interface CommentListQueryDTO {
    cursor?: number;
    limit: number;
}
export interface CommentResponseDTO extends Comment {
    nextCursor?: number | null;
}
export interface CreateFavoriteDTO {
    productId: number;
    userId: number;
}
export interface CreateLikeDTO {
    articleId: number;
    userId: number;
}
export interface RegisterDTO {
    email: string;
    nickname: string;
    password: string;
}
export interface LoginDTO {
    email: string;
    password: string;
}
//# sourceMappingURL=dto.d.ts.map