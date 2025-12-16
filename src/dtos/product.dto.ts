export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  tags: string[];
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
  status?: string;
}

export interface ProductResponseDto {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  user?: {
    id: number;
    nickname: string;
  };
  isLiked?: boolean;
  likeCount?: number;
}

export interface ProductListItemDto {
  id: number;
  name: string;
  price: number;
  createdAt: Date;
}
