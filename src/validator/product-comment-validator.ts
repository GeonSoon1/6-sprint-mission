// TODO) Product-Comment-Validator: 유효성 검사
import * as s from 'superstruct';

// 1) 댓글 본문 길이 제한
const Content = s.size(s.string(), 1, 100);

// 2) 댓글 생성 스키마 정의
export const CreateProductComment = s.object({
  productId: s.integer(),
  content: Content,
});

// 3) 댓글 수정 스키마 정의
export const PatchProductComment = s.object({
  content: Content,
});
