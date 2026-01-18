# 스프린트 미션 8

1. **실시간 알림 시스템 구현 (Socket.IO)**
2. **관심 상품 가격 변동 및 새 댓글 알림 기능**
3. **알림 관련 REST API 구현**

---

- Socket.IO 서버 구축 및 JWT 인증 연동
- Prisma 스키마 업데이트 (Notification 모델 추가)
- 이벤트 기반 알림 트리거 구현 (Service 계층 통합)

---

```
[디렉토리 구조]

8-sprint-mission (renamed from 6-sprint-mission)

├─ __http__/
│ ├─ article.http
│ ├─ comment.http
│ ├─ notification-test.http
│ ├─ notification.http
│ ├─ product.http
│ └─ user.http
├─ .github/
├─ mission-2/
├─ prisma/
│ ├─ migrations/
│ └─ schema.prisma
├─ src/
│ ├─ libs/
│ │ ├─ asyncHandler.ts
│ │ ├─ constants.ts
│ │ ├─ error.ts
│ │ └─ prismaClient.ts
│ ├─ middlewares/
│ │ ├─ errorHandler/
│ │ ├─ validates/
│ │ └─ auth.ts
│ ├─ modules/
│ │ ├─ articles/
│ │ │ ├─ article.controller.ts
│ │ │ ├─ article.dto.ts
│ │ │ ├─ article.repository.ts
│ │ │ ├─ article.router.ts
│ │ │ └─ article.service.ts
│ │ ├─ comments/
│ │ │ ├─ comment.controller.ts
│ │ │ ├─ ... (service, repo, router, dto)
│ │ ├─ images/
│ │ ├─ likes/
│ │ ├─ notifications/
│ │ ├─ products/
│ │ └─ users/
│ ├─ public/
│ │ └─ socket-client-test.html
│ ├─ seeds/
│ │ ├─ mock.ts
│ │ └─ seed.ts
│ ├─ server.ts
│ ├─ socket.ts
│ └─ upload.ts
├─ typings/
│ └─ express.d.ts
├─ uploads/
├─ .env
├─ .gitignore
├─ .prettierrc
├─ package-lock.json
├─ package.json
└─ README.md
```

### 실행방법

```

npm install
npx prisma migrate dev
npm run dev

```

### 테스트 방법

```

1. 프론트엔드 테스트
- http://localhost:3001/public/socket-client-test.html 접속
- JWT 토큰 입력 후 Connect
- 다른 탭/브라우저에서 이벤트 트리거(가격 변경, 댓글 작성) 후 알림 수신 확인

2. API 테스트
- RESTClient 설치
- **__http__** 디렉토리 활용 (notification-test.http)

```

---

#### 작성자 정보

```
이름 : 오윤

이메일 : passfile2@naver.com

제출일 : 2026-01-18
```
