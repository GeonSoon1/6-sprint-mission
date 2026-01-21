# Panda Market API Server (Refactored with DI)

## 개요

이 프로젝트는 'Panda Market' 중고 거래 애플리케이션을 위한 API 서버입니다. **Node.js, Express, TypeScript**를 기반으로 구축되었으며, **IoC(Inversion of Control, 제어의 역전)** 원칙을 적용하기 위해 **InversifyJS** 의존성 주입(DI) 프레임워크를 도입하여 아키텍처를 개선했습니다. 이를 통해 각 계층(Controller, Service, Repository) 간의 결합도를 낮추고 코드의 유연성, 테스트 용이성, 유지보수성을 극대화했습니다.

Prisma ORM을 통해 PostgreSQL 데이터베이스와 상호작용하며, 전통적인 Express 라우팅 방식과 DI 컨테이너를 결합하여 명확하고 확장 가능한 구조를 구현했습니다.

### 주요 기술

- **Backend:** Node.js, Express.js
- **언어:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **DI (Dependency Injection):** InversifyJS, reflect-metadata
- **인증:** JWT (jsonwebtoken), bcrypt
- **Validation:** class-validator, class-transformer
- **파일 업로드:** Multer
- **WebSocket:** Socket.io

### 주요 라이브러리

`package.json`을 기준으로 한 주요 의존성 라이브러리는 다음과 같습니다.

- **`@prisma/client`**: Prisma 클라이언트 (데이터베이스 쿼리용)
- **`express`**: 웹 프레임워크
- **`typescript`**: 타입스크립트 언어 지원
- **`inversify`**: 의존성 주입(DI) 컨테이너
- **`reflect-metadata`**: 데코레이터 메타데이터를 분석하기 위한 라이브러리 (InversifyJS 필수 의존성)
- **`jsonwebtoken`**: JWT 기반 인증 토큰 생성 및 검증
- **`bcrypt`**: 비밀번호 해싱
- **`class-validator`**, **`class-transformer`**: DTO 클래스 기반의 데이터 유효성 검사 및 변환
- **`multer`**: 파일 업로드(multipart/form-data) 처리
- **`socket.io`**: 실시간 양방향 통신 (알림 기능)

---

## 아키텍처 (DI와 Express Router 결합)

본 프로젝트는 **DI 컨테이너**가 계층별 객체 생성을 책임지고, **Express 라우터**가 HTTP 요청을 처리하는 역할을 명확히 분리한 아키텍처를 따릅니다.

1.  **DI 컨테이너 설정 (`src/lib/inversify.config.ts`)**
    - 프로젝트의 모든 서비스, 리포지토리, 컨트롤러 등 각 계층의 구현체를 식별자(`TYPES`)에 바인딩(연결)하는 **설정의 중심**입니다.
    - 애플리케이션에 필요한 모든 객체(인스턴스)는 이곳에서 생성되고 관리됩니다.

2.  **라우터 계층 (`src/routers/`)**
    - 각 기능(auth, users, products 등)별로 라우터 파일을 분리하여 관리합니다.
    - 각 라우터 파일은 DI 컨테이너(`inversify.config.ts`)에서 필요한 **컨트롤러 인스턴스를 주입**받습니다. (`container.get<MyController>(...)`)
    - 주입받은 컨트롤러의 메서드를 Express 경로(`router.get(...)`, `router.post(...)` 등)에 **수동으로 바인딩**하여 어떤 요청을 어떤 로직이 처리할지 결정합니다.

3.  **애플리케이션 진입점 (`src/main.ts`)**
    - Express 애플리케이션의 시작점입니다.
    - CORS, JSON 파서 등 **글로벌 미들웨어를 설정**합니다.
    - `src/routers/index.ts`에 통합된 **메인 라우터를 애플리케이션에 등록**하여 API 엔드포인트를 활성화합니다.

4.  **계층별 역할**
    - **`Controllers`**: HTTP 요청과 응답을 직접 처리합니다. 요청 데이터(body, params, query)를 DTO로 변환 및 검증하고, 비즈니스 로직 처리를 `Service` 계층에 위임한 뒤, 그 결과를 받아 클라이언트에 응답합니다.
    - **`Services`**: 애플리케이션의 핵심 비즈니스 로직을 수행합니다. 여러 리포지토리를 조합하여 복잡한 작업을 처리할 수 있으며, 컨트롤러로부터 독립적으로 설계됩니다.
    - **`Repositories`**: 데이터베이스 상호작용(CRUD)만을 담당합니다. Prisma Client를 사용하여 특정 데이터 모델에 대한 저수준(low-level) 작업을 수행합니다.

---

## 주요 기능

- **사용자 인증**: 회원가입, 로그인, 로그아웃, 토큰 갱신
- **사용자 관리**: 프로필 조회, 수정, 탈퇴, 사용자 검색
- **상품(Product) 관리**: 상품 등록, 조회, 수정, 삭제 (CRUD)
- **게시글(Article) 관리**: 게시글 등록, 조회, 수정, 삭제 (CRUD)
- **댓글(Comment) 관리**: 상품 및 게시글에 대한 댓글 CRUD
- **좋아요**: 게시글 좋아요/취소 토글 기능
- **실시간 알림**:
  - 관심 상품(좋아요) 가격 변동 시 알림 발송
  - 자신이 작성한 게시글에 댓글이 달렸을 때 알림 발송
  - 실시간 웹소켓(Socket.io) 기반 알림 전송
  - 알림 목록 조회 및 읽음 처리

---

## API Endpoints

API의 기본 경로는 `/` 입니다. (e.g., `http://localhost:3000`)

#### 👤 인증 (Auth) - `/auth`

| Method | Endpoint   | 인증 | 설명                     |
| :----- | :--------- | :--: | :----------------------- |
| `POST` | `/signup`  |  X   | 신규 사용자 회원가입     |
| `POST` | `/login`   |  X   | 이메일/비밀번호로 로그인 |
| `POST` | `/logout`  |  O   | 로그아웃 (토큰 비활성화) |
| `POST` | `/refresh` |  X   | Access Token 갱신        |

#### 🧑‍🤝‍🧑 사용자 (Users) - `/users`

| Method   | Endpoint | 인증 | 설명                  |
| :------- | :------- | :--: | :-------------------- |
| `GET`    | `/`      |  X   | 사용자 검색           |
| `GET`    | `/:id`   |  O   | 특정 사용자 정보 조회 |
| `PATCH`  | `/:id`   |  O   | 내 정보 수정          |
| `DELETE` | `/:id`   |  O   | 회원 탈퇴             |

#### 📦 상품 (Products) - `/products`

| Method   | Endpoint                          | 인증 | 설명                               |
| :------- | :-------------------------------- | :--: | :--------------------------------- |
| `GET`    | `/`                               |  X   | 전체 상품 목록 조회 (페이지네이션) |
| `POST`   | `/`                               |  O   | 신규 상품 등록                     |
| `GET`    | `/:id`                            |  X   | 특정 상품 상세 조회                |
| `PATCH`  | `/:id`                            |  O   | 상품 정보 수정                     |
| `DELETE` | `/:id`                            |  O   | 상품 삭제                          |
| `GET`    | `/:productId/comments`            |  X   | 특정 상품의 댓글 목록 조회         |
| `POST`   | `/:productId/comments`            |  O   | 특정 상품에 댓글 작성              |
| `PATCH`  | `/:productId/comments/:commentId` |  O   | 상품 댓글 수정                     |
| `DELETE` | `/:productId/comments/:commentId` |  O   | 상품 댓글 삭제                     |

#### 📝 게시글 (Articles) - `/articles`

| Method   | Endpoint                          | 인증 | 설명                                 |
| :------- | :-------------------------------- | :--: | :----------------------------------- |
| `GET`    | `/`                               |  X   | 전체 게시글 목록 조회 (페이지네이션) |
| `POST`   | `/`                               |  O   | 신규 게시글 작성                     |
| `GET`    | `/:id`                            |  O   | 특정 게시글 상세 조회                |
| `PATCH`  | `/:id`                            |  O   | 게시글 정보 수정                     |
| `DELETE` | `/:id`                            |  O   | 게시글 삭제                          |
| `POST`   | `/:id/like`                       |  O   | 게시글 좋아요/취소 토글              |
| `GET`    | `/:articleId/comments`            |  X   | 특정 게시글의 댓글 목록 조회         |
| `POST`   | `/:articleId/comments`            |  O   | 특정 게시글에 댓글 작성              |
| `PATCH`  | `/:articleId/comments/:commentId` |  O   | 게시글 댓글 수정                     |
| `DELETE` | `/:articleId/comments/:commentId` |  O   | 게시글 댓글 삭제                     |

#### 🔔 알림 (Notifications) - `/notifications`

| Method  | Endpoint    | 인증 | 설명                     |
| :------ | :---------- | :--: | :----------------------- |
| `GET`   | `/`         |  O   | 내 알림 목록 조회        |
| `POST`  | `/`         |  O   | 알림 생성 (테스트용)     |
| `GET`   | `/unread`   |  O   | 읽지 않은 알림 개수 조회 |
| `PATCH` | `/:id/read` |  O   | 알림 읽음 처리           |

---

## 프로젝트 폴더 구조

```
.
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── main.ts              <-- Express 앱 설정 및 실행
│   ├── controllers/         <-- HTTP 요청/응답 처리 로직
│   ├── services/            <-- 비즈니스 로직
│   ├── repositories/        <-- 데이터베이스 접근 로직
│   ├── routers/             <-- API 엔드포인트 정의 및 컨트롤러 연결
│   │   ├── index.ts         <-- 모든 라우터 통합
│   │   ├── authRouter.ts
│   │   └── ... (기타 라우터)
│   ├── dto/                 <-- 데이터 전송 객체 (유효성 검사 규칙 포함)
│   ├── lib/
│   │   ├── inversify.config.ts  <-- DI 컨테이너 설정
│   │   └── errors/
│   ├── middlewares/         <-- Express 미들웨어 (인증, 에러 핸들링 등)
│   └── types/
│       └── di.ts            <-- DI 주입 식별자(타입)
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
...
```

---

## 개발 컨벤션

- **코드 스타일**: Prettier를 사용하여 일관된 코드 스타일을 유지합니다.
- **의존성 주입(DI)**:
  - 주입 가능한 모든 클래스(서비스, 리포지토리, 컨트롤러)는 `@injectable()` 데코레이터를 가져야 합니다.
  - 의존성은 생성자 주입을 원칙으로 하며, `@inject(TYPES.Identifier)` 데코레이터를 사용하여 주입받을 대상을 명시합니다.
  - 모든 의존성 바인딩 정보는 `inversify.config.ts`에서 중앙 관리합니다.
- **라우팅**:
  - `src/routers` 폴더에서 기능별로 라우터 파일을 관리합니다.
  - 각 라우터 파일은 Inversify 컨테이너에서 컨트롤러 인스턴스를 `get()`하여 사용합니다.
  - Express의 `Router`를 사용하여 경로와 컨트롤러 메서드를 명시적으로 연결합니다.
- **비동기 처리**: 컨트롤러의 비동기 로직은 `asyncHandler` 유틸리티로 감싸 중앙 `errorHandler`에서 에러를 일괄 처리합니다.
- **데이터 유효성 검사**:
  - `src/dto/` 폴더에 각 기능별 DTO 클래스를 정의하고 `class-validator` 데코레이터를 사용해 유효성 규칙을 선언합니다.
  - 라우터에 `validator` 미들웨어를 사용하여 해당 DTO를 기준으로 요청 데이터를 검증합니다. 예: `validator(CreateArticleDto)`

---

## 실행

### 전제 조건

- Node.js 설치
- PostgreSQL 데이터베이스 실행
- 프로젝트 루트에 `DATABASE_URL`이 포함된 `.env` 파일 생성

**.env 파일 예시**

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
PORT=3000
JWT_SECRET_KEY=your_jwt_secret_key
```

### 데이터베이스 초기화 및 시드

처음 프로젝트를 설정할 때 다음 명령어를 실행하여 데이터베이스 스키마를 적용하고 초기 데이터를 삽입합니다.

```bash
# 데이터베이스 스키마를 마이그레이션합니다.
npx prisma migrate dev

# 초기 데이터를 시드합니다.
npx prisma db seed
```

### 애플리케이션 실행

개발 모드에서는 `nodemon`과 `ts-node`를 사용하여 파일 변경 시 서버가 자동으로 재시작됩니다.

```bash
# 의존성 설치
npm install

# 개발 모드로 실행
npm run dev
```

프로덕션 환경에서는 먼저 TypeScript를 JavaScript로 컴파일한 후 실행합니다.

```bash
# 프로덕션용 빌드
npm run build

# 프로덕션 모드로 실행
npm run start
```

서버가 성공적으로 실행되면 콘솔에 `Server listening on port [PORT]` 메시지가 출력됩니다.
