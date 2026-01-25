// ArticleService.js
// Article API 요청 함수들을 구현합니다.
// https://panda-market-api-crud.vercel.app/docs 의 Article API를 사용합니다.

import axios from "axios";

// ==================== 상수 정의 ====================
const BASE = "https://panda-market-api-crud.vercel.app/articles";
const MAX_PAGE_SIZE = 100; // 최대 페이지 크기 제한
const MIN_STRING_LENGTH = 1; // 최소 문자열 길이

// 허용된 patch 필드 (보안을 위해 명시적으로 정의)
const ALLOWED_PATCH_FIELDS = ["title", "content", "image"];

// ==================== 유틸리티 함수 ====================

/**
 * HTTP 응답 상태 코드를 검증하고 데이터를 반환합니다.
 * @param {Object} res - axios 응답 객체
 * @param {string} action - 실행 중인 액션 이름 (에러 메시지용)
 * @returns {Object} 응답 데이터
 * @throws {Error} HTTP 에러가 발생한 경우
 */
function okOrThrow(res, action) {
  if (res.status >= 200 && res.status < 300) {
    return res.data;
  }

  const msg = `[Article API Error] ${action} -> ${res.status} ${res.statusText}`;
  console.error(msg);
  throw new Error(msg);
}

/**
 * 문자열이 유효한 URL인지 검증합니다.
 * @param {string} url - 검증할 URL 문자열
 * @returns {boolean} 유효한 URL이면 true
 */
function isValidUrl(url) {
  if (typeof url !== "string" || url.length === 0) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * axios 에러를 처리하고 사용자 친화적인 메시지를 반환합니다.
 * @param {Error} error - axios 에러 객체
 * @param {string} action - 실행 중인 액션 이름
 * @returns {Error} 처리된 에러 객체
 */
function handleAxiosError(error, action) {
  if (error.response) {
    // 서버가 응답했지만 에러 상태 코드
    const status = error.response.status;
    const data = error.response.data;
    const message = data?.message || data?.error || `HTTP ${status} Error`;
    console.error(`[Article API] ${action} failed: ${message}`);
    return new Error(`[${action}] ${message}`);
  } else if (error.request) {
    // 요청이 전송되었지만 응답을 받지 못함
    console.error(`[Article API] ${action} failed: No response from server`);
    return new Error(
      `[${action}] 서버 응답이 없습니다. 네트워크를 확인해주세요.`
    );
  } else {
    // 요청 설정 중 에러 발생
    console.error(`[Article API] ${action} failed:`, error.message);
    return new Error(`[${action}] ${error.message}`);
  }
}
/**
 * 게시글 목록을 조회합니다.
 * @param {number} [page=1] - 페이지 번호 (1 이상)
 * @param {number} [pageSize=10] - 페이지당 항목 수 (1 이상, 최대 100)
 * @param {string} [keyword=''] - 검색 키워드
 * @returns {Promise<Object>} 게시글 목록과 메타데이터를 포함한 객체
 * @throws {Error} 유효하지 않은 파라미터나 API 에러 발생 시
 */
export function getArticleList(page = 1, pageSize = 10, keyword = "") {
  try {
    // 파라미터 유효성 검사
    if (typeof page !== "number" || !Number.isInteger(page) || page < 1) {
      throw new Error("page must be a positive integer");
    }
    if (
      typeof pageSize !== "number" ||
      !Number.isInteger(pageSize) ||
      pageSize < 1 ||
      pageSize > MAX_PAGE_SIZE
    ) {
      throw new Error(
        `pageSize must be a positive integer between 1 and ${MAX_PAGE_SIZE}`
      );
    }
    if (typeof keyword !== "string") {
      throw new Error("keyword must be a string");
    }

    console.log(
      `[Article API] GET ${BASE} - page: ${page}, pageSize: ${pageSize}, keyword: "${keyword}"`
    );

    return axios
      .get(`${BASE}`, {
        params: { page, pageSize, keyword },
        headers: {
          Accept: "application/json",
        },
      })
      .then((res) => okOrThrow(res, "getArticleList"))
      .catch((err) => {
        throw handleAxiosError(err, "getArticleList");
      });
  } catch (error) {
    console.error(
      "getArticleList() parameter validation failed:",
      error.message
    );
    throw error;
  }
}

/**
 * 특정 ID의 게시글을 조회합니다.
 * @param {number|string} id - 게시글 ID
 * @returns {Promise<Object>} 게시글 정보 객체
 * @throws {Error} 유효하지 않은 ID나 API 에러 발생 시
 */
export function getArticle(id) {
  try {
    // ID 유효성 검사
    if (id === null || id === undefined || id === "") {
      throw new Error("id is required and cannot be empty");
    }
    if (typeof id !== "number" && typeof id !== "string") {
      throw new Error("id must be a valid number or string");
    }
    // 숫자 타입인 경우 양수인지 확인
    if (typeof id === "number" && (!Number.isInteger(id) || id <= 0)) {
      throw new Error("id must be a positive integer");
    }
    // 문자열 타입인 경우 숫자로 변환 가능한지 확인
    if (typeof id === "string" && !/^\d+$/.test(id)) {
      throw new Error("id must be a valid numeric string");
    }

    const url = `${BASE}/${id}`;
    console.log(`[Article API] GET ${url}`);

    return axios
      .get(url, {
        headers: {
          Accept: "application/json",
        },
      })
      .then((res) => okOrThrow(res, "getArticle"))
      .catch((err) => {
        throw handleAxiosError(err, "getArticle");
      });
  } catch (error) {
    console.error("getArticle() parameter validation failed:", error.message);
    throw error;
  }
}

/**
 * 새로운 게시글을 생성합니다.
 * @param {Object} articleData - 게시글 데이터
 * @param {string} articleData.title - 게시글 제목 (필수)
 * @param {string} articleData.content - 게시글 내용 (필수)
 * @param {string} [articleData.image] - 게시글 이미지 URL (선택)
 * @returns {Promise<Object>} 생성된 게시글 정보 객체
 * @throws {Error} 유효하지 않은 데이터나 API 에러 발생 시
 */
export function createArticle({ title, content, image }) {
  try {
    // 파라미터 객체 검증
    if (typeof title === "undefined" || typeof content === "undefined") {
      throw new Error("title and content are required");
    }

    // 필수 필드 유효성 검사
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      throw new Error("title is required and must be a non-empty string");
    }
    if (
      !content ||
      typeof content !== "string" ||
      content.trim().length === 0
    ) {
      throw new Error("content is required and must be a non-empty string");
    }

    // image URL 검증 (제공된 경우에만)
    if (image !== undefined) {
      if (typeof image !== "string" || image.trim().length === 0) {
        throw new Error("image must be a non-empty string if provided");
      }
      if (!isValidUrl(image)) {
        throw new Error("image must be a valid URL");
      }
    }

    // request body 구성
    const requestBody = {
      title: title.trim(),
      content: content.trim(),
      ...(image && { image: image.trim() }), // image가 있을 때만 포함
    };

    console.log(`[Article API] POST ${BASE}`, requestBody);

    return axios
      .post(BASE, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => okOrThrow(res, "createArticle"))
      .catch((err) => {
        throw handleAxiosError(err, "createArticle");
      });
  } catch (error) {
    console.error(
      "createArticle() parameter validation failed:",
      error.message
    );
    throw error;
  }
}

/**
 * 게시글의 일부 필드를 수정합니다.
 * @param {number|string} id - 게시글 ID
 * @param {Object} partial - 수정할 필드 객체 (title, content, image만 허용)
 * @returns {Promise<Object>} 수정된 게시글 정보 객체
 * @throws {Error} 유효하지 않은 파라미터나 API 에러 발생 시
 */
export function patchArticle(id, partial) {
  try {
    // ID 유효성 검사
    if (id === null || id === undefined || id === "") {
      throw new Error("id is required and cannot be empty");
    }
    if (typeof id !== "number" && typeof id !== "string") {
      throw new Error("id must be a valid number or string");
    }
    if (typeof id === "number" && (!Number.isInteger(id) || id <= 0)) {
      throw new Error("id must be a positive integer");
    }
    if (typeof id === "string" && !/^\d+$/.test(id)) {
      throw new Error("id must be a valid numeric string");
    }

    // partial 객체 검증
    if (!partial || typeof partial !== "object" || Array.isArray(partial)) {
      throw new Error("partial must be a non-null object");
    }

    // 허용된 필드만 포함하는지 검증
    const providedFields = Object.keys(partial);
    const invalidFields = providedFields.filter(
      (field) => !ALLOWED_PATCH_FIELDS.includes(field)
    );

    if (invalidFields.length > 0) {
      throw new Error(
        `Invalid fields: ${invalidFields.join(
          ", "
        )}. Allowed fields: ${ALLOWED_PATCH_FIELDS.join(", ")}`
      );
    }

    // 필드 값 검증
    const validatedData = {};
    for (const [key, value] of Object.entries(partial)) {
      if (value === null || value === undefined) {
        continue; // null/undefined는 제외
      }

      if (key === "title" || key === "content") {
        if (typeof value !== "string" || value.trim().length === 0) {
          throw new Error(`${key} must be a non-empty string`);
        }
        validatedData[key] = value.trim();
      } else if (key === "image") {
        if (typeof value !== "string" || value.trim().length === 0) {
          throw new Error("image must be a non-empty string");
        }
        if (!isValidUrl(value)) {
          throw new Error("image must be a valid URL");
        }
        validatedData[key] = value.trim();
      }
    }

    // 수정할 필드가 없는 경우
    if (Object.keys(validatedData).length === 0) {
      throw new Error("At least one valid field must be provided for update");
    }

    const url = `${BASE}/${id}`;
    console.log(`[Article API] PATCH ${url}`, validatedData);

    return axios
      .patch(url, validatedData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => okOrThrow(res, "patchArticle"))
      .catch((err) => {
        throw handleAxiosError(err, "patchArticle");
      });
  } catch (error) {
    console.error("patchArticle() parameter validation failed:", error.message);
    throw error;
  }
}

/**
 * 게시글을 삭제합니다.
 * @param {number|string} id - 삭제할 게시글 ID
 * @returns {Promise<Object>} 삭제 결과 객체
 * @throws {Error} 유효하지 않은 ID나 API 에러 발생 시
 */
export function deleteArticle(id) {
  try {
    // ID 유효성 검사
    if (id === null || id === undefined || id === "") {
      throw new Error("id is required and cannot be empty");
    }
    if (typeof id !== "number" && typeof id !== "string") {
      throw new Error("id must be a valid number or string");
    }
    if (typeof id === "number" && (!Number.isInteger(id) || id <= 0)) {
      throw new Error("id must be a positive integer");
    }
    if (typeof id === "string" && !/^\d+$/.test(id)) {
      throw new Error("id must be a valid numeric string");
    }

    const url = `${BASE}/${id}`;
    console.log(`[Article API] DELETE ${url}`);

    return axios
      .delete(url, {
        headers: {
          Accept: "application/json",
        },
      })
      .then((res) => okOrThrow(res, "deleteArticle"))
      .catch((err) => {
        throw handleAxiosError(err, "deleteArticle");
      });
  } catch (error) {
    console.error(
      "deleteArticle() parameter validation failed:",
      error.message
    );
    throw error;
  }
}

/**
 * 여행 관련 게시글을 생성합니다.
 * 이 함수는 미리 정의된 여행 게시글 데이터로 createArticle을 호출합니다.
 * @returns {Promise<Object>} 생성된 게시글 정보 객체
 * @throws {Error} 게시글 생성 실패 시
 */
export function createTravelArticle() {
  try {
    const articleData = {
      title: "여행 떠나기 전 공항에서.",
      content: "공항에서 설렘가득 담고.",
      image: "https://picsum.photos/600/400", // 유효한 예시 이미지 URL
    };

    console.log("[Article API] 여행 글 생성 시작...");
    return createArticle(articleData);
  } catch (err) {
    console.error("createTravelArticle() failed:", err.message);
    throw err;
  }
}
