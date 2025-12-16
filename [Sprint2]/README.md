## 개요

- 'Panda Market' 마켓플레이스 애플리케이션의 API CRUD 작업을 구현하는 Node.js 학습 프로젝트

### 학습내용

- 객체지향 프로그래밍 원칙 (추상화, 캡슐화, 상속, 다형성)
- axios를 사용한 REST API 연동
- ES6 모듈 (.mjs)
- Promise 기반 및 async/await 패턴

### 핵심기술

- Node.js
- ES Modules

### 주요 라이브러리

- `axios`

### 의존성 설치

```bash
npm install
```

### 아키텍처

- `main.mjs`: 서비스 레벨의 명령을 실행하기 위한 메인 진입점(CRUD 사용 예시 포함)
- `services/`: 비즈니스 로직 및 API 통신
  - `ArticleService.mjs`: Article에 대한 CRUD 작업 관리
  - `ProductService.mjs`: Product에 대한 CRUD 작업 관리(`ElectronicProduct` 로직 포함)
- `models/`: 애플리케이션 데이터 구조 정의
  - `Article.mjs`: Article 클래스
  - `Product.mjs`: Product 기본 클래스
  - `ElectronicProduct.mjs`: 전자제품용 서브 클래스
- `lib/`: 공유 유틸리티
  - `axios.js`: 미리 구성된 Axios 인스턴스
  - `constants.js`: API 기본 URL
  - `dummy.js`: 생성 및 업데이트 테스트를 위한 더미 데이터

---

## 주요 기능

- 게시글 관리: Article에 대한 CRUD 기능
- 상품 관리: Product에 대한 CRUD 기능
  - 특정 상품 유형 처리: `ElectronicProduct`와 같은 특정 유형 상품 처리
- API 연동: `axios`를 활용하여 백엔드 API와 비동기 통신

### 프로젝트 폴더 구조

```
.
├── main.mjs                    # 애플리케이션 메인 진입점
├── package.json                # 프로젝트 의존성 및 스크립트
├── package-lock.json
├── README.md                   # 프로젝트 안내
├── services/
│   ├── ArticleService.mjs      # Article 관련 비즈니스 로직
│   └── ProductService.mjs      # Product 관련 비즈니스 로직
├── models/
│   ├── Article.mjs             # Article 데이터 모델
│   ├── Product.mjs             # Product 데이터 모델
│   └── ElectronicProduct.mjs   # Electronic Product 데이터 모델
└── lib/
    ├── axios.js                # 설정된 Axios 인스턴스
    ├── constants.js            # 상수 (API 기본 URL)
    └── dummy.js                # 테스트용 더미 데이터
```

---

## 개발 컨벤션

- 코드 스타일: Prettier 사용 (`.prettierrc` 파일 확인)
- 모듈성: 기능별(모델, 서비스)로 모듈화
- 데이터 모델링:
  - 클래스 기반 모델(`Article`, `Product`) 사용
  - 데이터 직렬화를 위한 메서드(`toJSON`, `toServerData`) 포함
- API 상호작용: 백엔드 API와의 모든 상호작용은 `services` 모듈에 포함 (`axios` 수행)
- 오류 처리: 서비스는 API 요청에 대한 기본 오류 처리를 포함하며, 오류 응답 상태 및 메시지 로깅

### 클래스 계층 구조

**Article** (`lib/Article.mjs`)

- 프로퍼티 (private): `title`, `content`, `image`, `writer`, `likeCount`, `createdAt`
- 메서드: `like()`, `unlike()`
- `toServerData()`: API용 최소 데이터 반환 (title, content, image만)
- `toJSON()`: 로컬 사용을 위한 전체 객체 데이터 반환
- `createdAt`은 제공되지 않으면 현재 타임스탬프로 자동 설정

**Product** (`lib/Product.mjs`)

- 프로퍼티 (private): `name`, `description`, `price`, `tags`, `images`, `favoriteCount`
- 메서드: `favorite()`, `unfavorite()`
- `toJSON()`: 완전한 객체 표현 반환

**ElectronicProduct** (`lib/ElectronicProduct.mjs`)

- Product를 상속
- 추가 프로퍼티: `manufacturer`
- `toJSON()`을 오버라이드하여 manufacturer 포함

### API 서비스 아키텍처

**ArticleService.mjs**

- 비동기 작업에 `.then()/.catch()` 패턴 사용
- 함수: `getArticleList()`, `getArticle(id)`, `createArticle(data)`, `patchArticle(id, data)`, `deleteArticle(id)`
- 헬퍼: `makeArticle(data)` - Article 인스턴스 생성, 로컬 데이터(전체)와 서버 데이터(최소)를 분리
- 에러 처리: HTTP 상태 코드 및 네트워크 오류 로깅

**ProductService.mjs**

- 비동기 작업에 `async/await` 패턴 사용
- 함수: `getProductList()`, `getProduct(id)`, `createProduct(data)`, `patchProduct(id, data)`, `deleteProduct(id)`
- 가져온 인스턴스를 저장하기 위한 전역 `products` 배열 유지
- 헬퍼: `makeProduct(data)` - "전자제품" 태그가 있는 항목은 ElectronicProduct 인스턴스 생성, 그 외는 Product 인스턴스 생성하는 팩토리 함수
- API로 전송하기 전에 요청 페이로드에서 `favoriteCount`와 `manufacturer` 제거

---

## 주요 구현 세부사항

1. **클래스 인스턴스화 패턴**: 두 서비스 모두 API 응답에서 클래스 객체를 인스턴스화

   - Articles: 로깅용 인스턴스를 생성하지만 서버에는 최소 데이터만 전송
   - Products: "전자제품" 태그 기반으로 타입별 인스턴스(Product vs ElectronicProduct) 생성

2. **에러 처리 차이점**:

   - ArticleService: 로깅 후 에러를 throw
   - ProductService: `deleteProduct()`를 제외하고 에러를 throw (주석 처리됨)

3. **데이터 변환**:

   - `toServerData()`: Article API에 필요한 필드만 반환
   - `toJSON()`: 완전한 객체 상태 반환
   - Product 데이터에서 클라이언트 전용 필드를 제거하기 위한 수동 `delete` 작업

4. **캡슐화**: 모든 클래스 프로퍼티는 private 필드(`#property`)를 사용

---

## 실행

### 애플리케이션 실행

- `main.mjs`
  - 다양한 서비스 메서드를 테스트하기 위한 여러 함수 호출 포함
- 아래 명령어는 `package.json`에 정의된 `node main.mjs` 명령 실행

```bash
npm start
```

### 실행(테스트) 방법

1. `main.mjs`에서 원하는 함수 호출의 주석 해제
2. `npm start` 실행
3. 콘솔 출력에서 API 응답 확인 (Articles 및 Products 샘플(dummy) 테스트 데이터 제공)
