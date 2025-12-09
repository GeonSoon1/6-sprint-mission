// TODO) Product-Comment-Validator: 유효성 검사
import * as s from 'superstruct';

const Content = s.size(s.string(), 1, 100);

export const CreateProductComment = s.object({
  productId: s.integer(),
  content: Content,
});

export const PatchProductComment = s.object({
  content: Content,
});
