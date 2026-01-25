// productService.js
// Product API 요청 함수들을 구현합니다.
// https://panda-market-api-crud.vercel.app/docs 의 Product API를 사용합니다.

// ==================== 상수 정의 ====================
const BASE = "https://panda-market-api-crud.vercel.app/products";
const MAX_PAGE_SIZE = 100; // 최대 페이지 크기 제한
const MIN_STRING_LENGTH = 1; // 최소 문자열 길이
const MAX_PRICE = 999999999; // 최대 가격 제한

// 허용된 patch 필드 (보안을 위해 명시적으로 정의)
const ALLOWED_PATCH_FIELDS = ["name", "description", "price", "tags", "images"];

// ==================== 유틸리티 함수 ====================

/**
 * HTTP 응답을 파싱하고 에러를 처리합니다.
 * @param {Response} res - fetch Response 객체
 * @param {string} label - 실행 중인 액션 이름 (에러 메시지용)
 * @returns {Promise<Object>} 응답 데이터
 * @throws {Error} HTTP 에러가 발생한 경우
 */
async function parseOrThrow(res, label) {
  if (res.ok) {
    try {
      return await res.json();
    } catch (parseError) {
      const msg = `${label} failed: JSON parsing error`;
      console.error("[Product API Error]", msg, parseError);
      throw new Error(msg);
    }
  }

  let msg = `${label} failed (HTTP ${res.status} ${res.statusText})`;
  try {
    const errorData = await res.json();
    msg = errorData?.message || errorData?.error || msg;
  } catch (parseError) {
    // JSON 파싱 실패 시 기본 메시지 사용
  }

  console.error("[Product API Error]", msg);
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
 * fetch 에러를 처리하고 사용자 친화적인 메시지를 반환합니다.
 * @param {Error} error - fetch 에러 객체
 * @param {string} action - 실행 중인 액션 이름
 * @returns {Error} 처리된 에러 객체
 */
function handleFetchError(error, action) {
  if (error.message.includes("JSON parsing error")) {
    return new Error(`[${action}] 서버 응답 파싱에 실패했습니다.`);
  } else if (error.message.includes("failed to fetch")) {
    console.error(`[Product API] ${action} failed: Network error`);
    return new Error(
      `[${action}] 네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.`
    );
  } else {
    console.error(`[Product API] ${action} failed:`, error.message);
    return error;
  }
}

/**
 * 상품 목록을 조회합니다.
 * @param {number} [page=1] - 페이지 번호 (1 이상)
 * @param {number} [pageSize=10] - 페이지당 항목 수 (1 이상, 최대 100)
 * @param {string} [keyword=''] - 검색 키워드
 * @returns {Promise<Object>} 상품 목록과 메타데이터를 포함한 객체
 * @throws {Error} 유효하지 않은 파라미터나 API 에러 발생 시
 */
export async function getProductList(page = 1, pageSize = 10, keyword = "") {
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

    // URL 구성 - 쿼리 파라미터 사용
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      keyword: keyword,
    });
    const url = `${BASE}?${params.toString()}`;

    console.log(`[Product API] GET ${url}`);
    const res = await fetch(url);
    return await parseOrThrow(res, "getProductList");
  } catch (e) {
    console.error("getProductList() failed:", e.message);
    throw handleFetchError(e, "getProductList");
  }
}

/**
 * 특정 ID의 상품을 조회합니다.
 * @param {number|string} id - 상품 ID
 * @returns {Promise<Object>} 상품 정보 객체
 * @throws {Error} 유효하지 않은 ID나 API 에러 발생 시
 */
export async function getProduct(id) {
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
    console.log(`[Product API] GET ${url}`);
    const res = await fetch(url);
    return await parseOrThrow(res, "getProduct");
  } catch (e) {
    console.error("getProduct() failed:", e.message);
    throw handleFetchError(e, "getProduct");
  }
}

/**
 * 새로운 상품을 생성합니다.
 * @param {Object} productData - 상품 데이터
 * @param {string} productData.name - 상품명 (필수)
 * @param {string} productData.description - 상품 설명 (필수)
 * @param {number} productData.price - 상품 가격 (필수, 0 이상)
 * @param {string[]} [productData.tags] - 상품 태그 배열 (선택)
 * @param {string[]} [productData.images] - 상품 이미지 URL 배열 (선택)
 * @returns {Promise<Object>} 생성된 상품 정보 객체
 * @throws {Error} 유효하지 않은 데이터나 API 에러 발생 시
 */
export async function createProduct({
  name,
  description,
  price,
  tags = [],
  images = [],
}) {
  try {
    // 파라미터 객체 검증
    if (
      typeof name === "undefined" ||
      typeof description === "undefined" ||
      typeof price === "undefined"
    ) {
      throw new Error("name, description, and price are required");
    }

    // 필수 필드 유효성 검사
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      throw new Error("name is required and must be a non-empty string");
    }
    if (
      !description ||
      typeof description !== "string" ||
      description.trim().length === 0
    ) {
      throw new Error("description is required and must be a non-empty string");
    }
    if (typeof price !== "number" || price < 0 || price > MAX_PRICE) {
      throw new Error(`price must be a number between 0 and ${MAX_PRICE}`);
    }
    if (!Number.isInteger(price)) {
      throw new Error("price must be an integer");
    }

    // 배열 필드 검증
    if (!Array.isArray(tags)) {
      throw new Error("tags must be an array");
    }
    if (!Array.isArray(images)) {
      throw new Error("images must be an array");
    }

    // tags 배열 내부 검증
    if (
      tags.some((tag) => typeof tag !== "string" || tag.trim().length === 0)
    ) {
      throw new Error("all tags must be non-empty strings");
    }

    // images 배열 내부 검증 (URL 유효성 검사)
    if (images.some((image) => !isValidUrl(image))) {
      throw new Error("all images must be valid URLs");
    }

    // request body 구성
    const requestBody = {
      name: name.trim(),
      description: description.trim(),
      price,
      tags: tags.map((tag) => tag.trim()),
      images,
    };

    console.log(`[Product API] POST ${BASE}`, requestBody);
    const res = await fetch(BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    return await parseOrThrow(res, "createProduct");
  } catch (e) {
    console.error("createProduct() failed:", e.message);
    throw handleFetchError(e, "createProduct");
  }
}

/**
 * 상품의 일부 필드를 수정합니다.
 * @param {number|string} id - 상품 ID
 * @param {Object} partial - 수정할 필드 객체 (name, description, price, tags, images만 허용)
 * @returns {Promise<Object>} 수정된 상품 정보 객체
 * @throws {Error} 유효하지 않은 파라미터나 API 에러 발생 시
 */
export async function patchProduct(id, partial) {
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

      if (key === "name" || key === "description") {
        if (typeof value !== "string" || value.trim().length === 0) {
          throw new Error(`${key} must be a non-empty string`);
        }
        validatedData[key] = value.trim();
      } else if (key === "price") {
        if (typeof value !== "number" || value < 0 || value > MAX_PRICE) {
          throw new Error(`price must be a number between 0 and ${MAX_PRICE}`);
        }
        if (!Number.isInteger(value)) {
          throw new Error("price must be an integer");
        }
        validatedData[key] = value;
      } else if (key === "tags") {
        if (!Array.isArray(value)) {
          throw new Error("tags must be an array");
        }
        if (
          value.some(
            (tag) => typeof tag !== "string" || tag.trim().length === 0
          )
        ) {
          throw new Error("all tags must be non-empty strings");
        }
        validatedData[key] = value.map((tag) => tag.trim());
      } else if (key === "images") {
        if (!Array.isArray(value)) {
          throw new Error("images must be an array");
        }
        if (value.some((image) => !isValidUrl(image))) {
          throw new Error("all images must be valid URLs");
        }
        validatedData[key] = value;
      }
    }

    // 수정할 필드가 없는 경우
    if (Object.keys(validatedData).length === 0) {
      throw new Error("At least one valid field must be provided for update");
    }

    const url = `${BASE}/${id}`;
    console.log(`[Product API] PATCH ${url}`, validatedData);
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(validatedData),
    });
    return await parseOrThrow(res, "patchProduct");
  } catch (e) {
    console.error("patchProduct() failed:", e.message);
    throw handleFetchError(e, "patchProduct");
  }
}

/**
 * 상품을 삭제합니다.
 * @param {number|string} id - 삭제할 상품 ID
 * @returns {Promise<Object>} 삭제 결과 객체
 * @throws {Error} 유효하지 않은 ID나 API 에러 발생 시
 */
export async function deleteProduct(id) {
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
    console.log(`[Product API] DELETE ${url}`);
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });
    return await parseOrThrow(res, "deleteProduct");
  } catch (e) {
    console.error("deleteProduct() failed:", e.message);
    throw handleFetchError(e, "deleteProduct");
  }
}

/**
 * Bespoke AI 제트 400W 제품을 생성합니다.
 * 이 함수는 미리 정의된 제품 데이터로 createProduct를 호출합니다.
 * @returns {Promise<Object>} 생성된 제품 정보 객체
 * @throws {Error} 제품 생성 실패 시
 */
export async function createBespokeAIJet() {
  try {
    const productData = {
      name: "Bespoke AI 제트 400W",
      description: "삼성전자 Bespoke AI 제트 400W 무선 청소기",
      price: 599000,
      tags: ["무선청소기", "삼성전자", "AI", "전자품"],
      images: ["https://picsum.photos/640/480"], // 유효한 예시 이미지 URL
    };

    console.log("[Product API] Bespoke AI 제트 400W 제품 생성 시작...");
    return await createProduct(productData);
  } catch (e) {
    console.error("createBespokeAIJet() failed:", e.message);
    throw e;
  }
}
