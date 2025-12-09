// TODO) Validate: 공통 유효성 검사
// &) Library Import
import { assert } from 'superstruct';

//&) Core Import
import { ValidationError } from '../core/error/error-handler.js';

export default function validate(schema) {
  return (req, _res, next) => {
    try {
      assert(req.body, schema);
      next();
    } catch (error) {
      let first = null;
      if (typeof error?.failures === 'function') {
        const f = error.failures();
        if (f) {
          if (typeof f.next === 'function') {
            first = f.next().value;
          } else if (Array.isArray(f)) {
            first = f[0];
          }
        }
      }

      const path = first?.path?.join('.') || error.path?.join?.('.') || null;

      const message =
        resolveCustomMessage(path, first) ||
        first?.message ||
        '요청 데이터가 올바르지 않습니다';

      throw new ValidationError(path, message);
    }
  };
}

const resolveCustomMessage = (path, failure) => {
  if (!path) return null;

  const map = {
    email: '이메일 형식이 올바르지 않습니다.',
    password: '비밀번호는 8~64자여야 합니다.',
    nickname: '닉네임은 1~30자여야 합니다.',
    image: '이미지 확장자는 jpg, jpeg, png만 허용됩니다.',
    name: '상품명은 1~20자여야 합니다.',
    price: '가격은 0 이상이어야 합니다.',
    stock: '재고는 0 이상의 정수여야 합니다.',
    tags: 'tags는 NONE, FASHION, BEAUTY, SPORTS, ELECTRONICS, HOME_INTERIOR, HOUSEHOLD_SUPPLIES, KITCHENWARE 중 하나여야 합니다.',
    title: '제목은 1~30자여야 합니다.',
    content: '내용은 1~100자 이내여야 합니다.',
    productId: 'productId는 1 이상의 정수여야 합니다.',
    articleId: 'articleId는 1 이상의 정수여야 합니다.',
    quantity: 'quantity는 1 이상의 정수여야 합니다.',
  };

  if (map[path]) return map[path];

  if (failure?.type === 'imagePathExt' || failure?.refinement === 'imagePathExt') {
    return 'imagePath는 jpg, jpeg, png 확장자여야 합니다.';
  }

  const typeMap = {
    string: '문자열',
    number: '숫자',
    integer: '정수',
    boolean: '불리언',
    array: '배열',
    object: '객체',
  };

  if (failure?.type && typeMap[failure.type]) {
    return `${path}는 ${typeMap[failure.type]}이어야 합니다.`;
  }

  if (failure?.type === 'min') {
    return `${path}는 최소값보다 커야 합니다.`;
  }
  if (failure?.type === 'max') {
    return `${path}는 최대값을 초과할 수 없습니다.`;
  }
  if (failure?.type === 'size') {
    return `${path}의 길이가 제한을 초과하거나 부족합니다.`;
  }
  if (failure?.type === 'enum' || failure?.type === 'enums') {
    return `${path} 값이 허용된 목록에 없습니다.`;
  }

  return null;
};
