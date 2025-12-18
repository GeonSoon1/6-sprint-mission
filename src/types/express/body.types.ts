export interface ProductCustom {
  id: number;
  userId: number;
  name: String;
  description: String;
  price: number;
  tags: String[];
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCommentCustom {
  id: number;
  userId: number;
  productId: number;
  content: String;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticleCustom {
  id: number;
  userId: number;
  title: String;
  content?: String;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticleCommentCustom {
  id: number;
  userId: number;
  articleId: number;
  content: String;
  createdAt: Date;
  updatedAt: Date;
}
