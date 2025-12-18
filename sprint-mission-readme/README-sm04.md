## 요구사항

### [ 목표 ]

- 토큰 기반 유저 인증 및 인가 구현
- [심화] Refresh Token 구현하기
- [심화] Prisma로 관계형 활용하기

### [ 작업 내용 ]

### 1. 기본 요구사항

### 1.1 회원 인증 기능

- USER 스키마 작성

  - [x] 모델 선언 : model User
    - [x] 개별 필드 항목 : id, email, nicknamee, image, password, createdAt, updatedAt
    - [x] 관계형 필드 항목 : createProducts(Product[]), createArticle(Article[]), commentProducts(CommentProduct[]), commentArticles(CommentArticle[])

- 회원 인증 관련 API 작성
  - [x] 회원가입(POST)
    - [x] 사용 값 : nickname, password, email
    - [x] password의 경우 해싱 작업 진행
  - [x] 로그인(POST)
    - [x] 사용 값 : email, password
    - [x] password의 경우 역해싱 작업을 통해 회원 확인
    - [x] 인증을 마친 뒤 Access Token, Refresh Token 생성
    - [x] 생성된 Access Token, Refresh Token을 쿠키에 담아서 클라이언트에 전달
  - [x] 로그아웃(POST)
    - [x] 활성화 된 Access Token, Refresh Token의 사용 기한을 만료 시킴
  - [x] 각 API 응답에 적절한 상태 코드 리턴
  - [x] 각 API에 맞는 적절한 에러 처리 진행

### 1.2 회원 인가 기능

- 기존 모델 스키마 수정

  - [x] 모델 Product : 관계형 필드 userId(User[]) 추가
  - [x] 모델 Article : 관계형 필드 userId(User[]) 추가
  - [x] 모델 CommentProduct : 관계형 필드 userId(User[]) 추가
  - [x] 모델 CommentArticle : 관계형 필드 userId(User[]) 추가

- 회원 인가 관련 API 생성

  - 모델 User
    - [x] 유저 정보 확인(GET) : 회원 가입 시 작성 한 자신의 "유저 정보"만 확인 가능
    - [x] 유저 정보 수정(PATCH) : 회원 가입 시 작성 한 자신의 "유저 정보"만 수정 가능
    - [x] 유저 패스워드 수정(PATCH) : 자신의 "비밀 번호"만 수정 가능
    - [x] 작성한 제품 리스트 확인(GET) : 자신이 생성한 "제품"만 목록으로 확인 가능
    - [x] 작성한 게시글 리스트 확인(GET) : 자신이 생성한 "게시글"만 목록으로 확인 가능

- 회원 인가 관련 API 수정
  - 모델 Product
    - [x] 제품 등록(POST) : 로그인 한 유저만 제품을 등록 할 수 있음
    - [x] 제품 수정(PATCH) : 자신이 등록 한 제품만 상세 정보를 수정 할 수 있음
    - [x] 제품 삭제(DELETE) : 자신이 등록 한 제품만 삭제 할 수 있음
  - 모델 Article
    - [x] 게시글 등록(POST) : 로그인 한 유저만 게시글을 등록 할 수 있음
    - [x] 게시글 수정(PATCH) : 자신이 등록 한 게시글만 정보를 수정 할 수 있음
    - [x] 게시글 삭제(DELETE) : 자신이 등록 한 게시글만 삭제 할 수 있음
  - 모델 CommentProduct
    - [x] 제품 댓글 등록(POST) : 로그인 한 유저만 제품의 댓글을 등록 할 수 있음
    - [x] 제품 댓글 수정(PATCH) : 자신이 등록 한 댓글만 수정 할 수 있음
    - [x] 제품 댓글 삭제(DELETE) : 자신이 등록 한 댓글만 삭제 할 수 있음
  - 모델 CommentArticle
    - [x] 게시글 댓글 등록(POST) : 로그인 한 유저만 게시글의 댓글을 등록 할 수 있음
    - [x] 게시글 댓글 수정(PATCH) : 자신이 등록 한 댓글만 수정 할 수 있음
    - [x] 게시글 댓글 삭제(DELETE) : 자신이 등록 한 댓글만 삭제 할 수 있음

### 2. 심화 요구사항

2.1 Refresh Token 발급

- [x] Refresh Token 재발급(POST) : 발급했던 토큰을 기반으로 Refresh Token 재발급

  <br>
2.2 "좋아요" 기능 추가

- ProductLikes / ArticleLikes 스키마 작성

  - 모델 선언 : model ProductLikes

    - [x] 개별 필드 항목 : id, likeCountBool, createdAt, updatedAt
    - [x] 관계형 필드 항목 : userId(User), productId(ProductId)

  - 모델 선언 : model ArticleLikes

    - [x] 개별 필드 항목 : id, likeCountBool, createdAt, updatedAt
    - [x] 관계형 필드 항목 : userId(User), articleId(Article)

- 기존 모델 스키마 수정

  - [x] 모델 User : 관계형 필드 likeProducts(ProductLikes[]), likeArticles(ArticleLikes[]) 추가
  - [x] 모델 Product : "좋아요" 총 숫자 필드, 관계형 필드 userId(User[]) 추가
  - [x] 모델 Article : 관계형 필드 userId(User[]) 추가

- API 작성

  - 모델 User

    - [x] "좋아요" 한 제품 리스트 확인(GET) : 자신이 "좋아요"를 누른 "제품"만 목록으로 확인 가능
    - [x] "좋아요" 한 제품 리스트 확인(GET) : 자신이 "좋아요"를 누른 "게시글"만 목록으로 확인 가능

  - 모델 Product

    - [x] "좋아요" 등록(POST) : 서버에 등록 된 제품에 "좋아요"를 할 수 있음
    - [x] "좋아요" 확인(GET) : 제품 상세페이지 조회 시 자신이 "좋아요" 한 제품 인지 확인 가능
    - [x] "좋아요" 삭제(DELETE) : 자신이 "좋아요"를 한 제품에 취소 할 수 있음

  - 모델 Article
    - [x] "좋아요" 등록(POST) : 서버에 등록 된 게시글에 "좋아요"를 할 수 있음
    - [x] "좋아요" 확인(GET) : 제품 상세페이지 조회 시 자신이 "좋아요" 한 게시글 인지 확인 가능
    - [x] "좋아요" 삭제(DELETE) : 자신이 "좋아요"를 한 게시글에 취소 할 수 있음

<br><br><br><br>

## 멘토에게

주먹구구로 코드 작업을 해서, 주말에 검증(validate) / Tag 기능 구현 등 일부 코드를 최종 수정하고 보내려고 했으나<br>
지금 감기가 심하게 와서 MD 파일만 겨우 작성해서 제출합니다 ㅠㅠ

코드가 반복되어 읽기 힘들더라도 양해 부탁드립니다!
