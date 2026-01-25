// constants.js
// 프로젝트 전체에서 사용하는 상수들을 정의합니다.

// ==================== API 기본 URL ====================
export const API_BASE_URL = "https://panda-market-api-crud.vercel.app";

export const ARTICLE_BASE_URL = `${API_BASE_URL}/articles`;
export const PRODUCT_BASE_URL = `${API_BASE_URL}/products`;

// ==================== 공통 제한 상수 ====================
export const MAX_PAGE_SIZE = 100; // 최대 페이지 크기 제한
export const MIN_STRING_LENGTH = 1; // 최소 문자열 길이
export const MAX_PRICE = 999999999; // 최대 가격 제한

// ==================== 허용된 필드 ====================
// Article PATCH 요청에서 허용되는 필드
export const ALLOWED_ARTICLE_PATCH_FIELDS = ["title", "content", "image"];

// Product PATCH 요청에서 허용되는 필드
export const ALLOWED_PRODUCT_PATCH_FIELDS = [
  "name",
  "description",
  "price",
  "tags",
  "images",
];

// ==================== HTTP 상태 코드 ====================
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// ==================== 타임아웃 설정 ====================
export const REQUEST_TIMEOUT = 10000; // 10초

// ==================== 기본 헤더 ====================
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};
