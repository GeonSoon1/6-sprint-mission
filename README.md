# 스프린트 미션 5

1. **타입스크립트 마이그레이션**
2. **타입스크립트 개발 환경 세팅하기**
3. **Layered Architecture 적용**
4. **계층간에 DTO 사용**

---

- 디렉토리 파일 js 에서 ts로 변환
- 기존의 미흡한 코드 개선 및 수정

---

```
[디렉토리 구조]

6-sprint-mission

├─ __http__/
│ ├─ article.http
│ ├─ comment.http
│ ├─ product.http
│ └─ user.http
├─ .github/
├─ mission-2/
├─ prisma/
│ ├─ migrations/
│ └─ schema.prisma
├─ src/
│ ├─ controller/
│ │ ├─ articleController.ts
│ │ ├─ commentController.ts
│ │ ├─ imageController.ts
│ │ ├─ productController.ts
│ │ └─ userController.ts
│ ├─ dto/
│ │ ├─ articleDto.ts
│ │ ├─ commentDto.ts
│ │ ├─ productDto.ts
│ │ └─ userDto.ts
│ ├─ lib/
│ │ ├─ asyncHandler.ts
│ │ ├─ constants.ts
│ │ ├─ error.ts
│ │ └─ prismaClient.ts
│ ├─ middlewares/
│ │ ├─ errorHandler/
│ │ │ └─ errorHandler.ts
│ │ ├─ validate/
│ │ │ ├─ validateArticle.ts
│ │ │ ├─ validateComment.ts
│ │ │ ├─ validateId.ts
│ │ │ ├─ validateProduct.ts
│ │ │ └─ validateUser.ts
│ │ └─ auth.ts
│ ├─ repogitories/
│ │ ├─ articleRepogitory.ts
│ │ ├─ commentRepogitory.ts
│ │ ├─ likeRepogitory.ts
│ │ ├─ producRepogitoryr.ts
│ │ └─ userRepogitory.ts
│ ├─ router/
│ │ ├─ articleRouter.ts
│ │ ├─ commentRouter.ts
│ │ ├─ imageRouter.ts
│ │ ├─ productRouter.ts
│ │ └─ userRouter.ts
│ ├─ seed/
│ │ ├─ mock.ts
│ │ └─ seed.ts
│ ├─ services/
│ │ ├─ articleService.ts
│ │ ├─ commentService.ts
│ │ ├─ likeService.ts
│ │ ├─ productService.ts
│ │ └─ userService.ts
│ └─ server.ts
│ └─ uploads.ts
├─ typings/
│ └─ express.d.ts
├─ uploads/
├─ .env.sample
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

RESTClient 설치
**http** 디렉토리 활용

```

---

#### 작성자 정보

```
이름 : 오윤

이메일 : passfile2@naver.com

제출일 : 2025-12-17
```
