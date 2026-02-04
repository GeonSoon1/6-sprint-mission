# 스프린트 미션 9

1. **테스트 코드 작성 (Jest, Supertest)**
2. **단위 테스트 및 통합 테스트 구현**
3. **테스트 커버리지 80% 이상 달성**

---

- **Test Environment**: Jest, Supertest 설정 및 Mocking 처리
- **Coverage**: 전체 라인 커버리지 90% 달성 (주요 모듈 80% 이상)
- **Stability**: 예외 케이스 및 경계값 테스트 강화 (Validation 등)

---

```
[디렉토리 구조]

9-sprint-mission

├─ __http__/
│ ├─ article.http
│ ├─ comment.http
│ ├─ notification-test.http
│ ├─ notification.http
│ ├─ product.http
│ └─ user.http
├─ .github/
├─ prisma/
│ ├─ migrations/
│ └─ schema.prisma
├─ src/
│ ├─ libs/
│ ├─ middlewares/
│ ├─ modules/
│ │ ├─ articles/
│ │ ├─ comments/
│ │ ├─ images/
│ │ ├─ likes/
│ │ ├─ notifications/
│ │ ├─ products/
│ │ └─ users/
│ ├─ seeds/
│ ├─ app.ts
│ ├─ server.ts
│ └─ socket.ts
├─ tests/
│ ├─ unit/
│ │ ├─ notification.service.test.ts
│ │ └─ product.service.test.ts
│ ├─ article.test.ts
│ ├─ auth.test.ts
│ ├─ comment.test.ts
│ ├─ image.test.ts
│ ├─ like.test.ts
│ ├─ notification.test.ts
│ ├─ product.test.ts
│ ├─ user.test.ts
│ └─ validation.test.ts
├─ uploads/
├─ .env
├─ .env.test
├─ jest.config.js
├─ package.json
└─ README.md
```

### 실행 방법

```

npm install
npx prisma migrate dev
npm run dev

# 테스트 실행
npm test

# 커버리지 확인
npm test -- --coverage

```

### 테스트 방법

```

1. 통합 테스트 (Integration)
- Product, Article, Comment 등 주요 API 흐름 검증
- Supertest를 활용한 HTTP 요청/응답 테스트

2. 단위 테스트 (Unit)
- Service 레이어 비즈니스 로직 검증
- Repository, Socket 등 외부 의존성 Mocking

```

---

#### 작성자 정보

```
이름 : 오윤

이메일 : wingruni@gmail.com

제출일 : 2026-02-01
```
