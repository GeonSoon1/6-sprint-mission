// src/types/index.ts

/**
 * 페이지네이션 쿼리 파라미터 (Offset 방식)
 */
export interface PaginationQuery {
  page?: string;
  limit?: string;
  orderBy?: string;
  keyword?: string;
}

/**
 * 커서 기반 페이지네이션 쿼리 파라미터
 */
export interface CursorPaginationQuery {
  cursor?: string;
  limit?: string;
}

/**
 * JWT 토큰 페이로드
 */
export interface TokenPayload {
  id: number;
  email: string;
  nickname: string;
  iat?: number;
  exp?: number;
  iss?: string;
}

/**
 * 페이지네이션 응답 (Offset 방식)
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

/**
 * 커서 기반 페이지네이션 응답
 */
export interface CursorPaginatedResponse<T> {
  data: T[];
  nextCursor: number | null;
}

/**
 * API 성공 응답
 */
export interface SuccessResponse<T = any> {
  success: true;
  data?: T;
  message?: string;
}

/**
 * API 에러 응답
 */
export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}

/**
 * API 응답 (성공 또는 에러)
 */
export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

/**
 * 정렬 순서
 */
export type SortOrder = "asc" | "desc" | "recent";

/**
 * 상품 상태
 */
export type ProductStatus = "SALE" | "SOLD_OUT" | "RESERVED";
