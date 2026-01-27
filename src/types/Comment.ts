export interface Comment {
  id: number;
  content: string;
  userId: number;
  articleId: number | null;
  productId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateCommentData = Omit<
  Comment,
  'id' | 'productId' | 'articleId' | 'createdAt' | 'updatedAt'
> & {
  productId?: number;
  articleId?: number;
};

export default Comment;
