```mermaid
erDiagram

    Users {
        Int id PK
        String nickname UK "유니크"
        DateTime created_at
        DateTime updated_at
    }

    UserCredential {
        Int id PK
        Int userId FK
        String email UK "로그인 ID"
        String password "Nullable (소셜유저는 없음)"
        DateTime updated_at
    }

    SocialAccounts {
        Int id PK
        Int userId FK
        String provider "google, kakao"
        String providerId "소셜 고유 ID"
        DateTime created_at
        DateTime updated_at
    }

    Token {
        Int id PK
        Int userId FK
        String refresh_token UK
        String userAgent "기기 정보"
        DateTime expires_at
        DateTime created_at
    }

    Products {
        Int id PK
        Int authorId FK
        Int categoryId FK "Categories(id)"
        Int status FK "Status(id)"
        String name
        String description
        Int current_price "현재 가격"
        Int viewCount "상품 조회수"
        String image "URL (1개)"
        String[] tags "태그 배열"
        DateTime created_at
        DateTime updated_at
    }

    PriceHistory{
        Int id PK
        Int productId FK
        Int price
        DateTime created_at
    }

    Categories {
        Int id PK
        String name UK
    }

    Status {
        Int id PK
        String name UK
    }

    Favorites {
        Int id PK
        Int productId FK
        Int authorId FK
        DateTime created_at
        %% UK: [authorId, productId] 중복 방지
    }

    ProductComments {
        Int id PK
        Int productId FK
        Int authorId FK
        String content
        DateTime created_at
        DateTime updated_at
    }

    Articles {
        Int id PK
        Int authorId FK
        String title
        String content
        Int viewCount "게시글 조회수"
        String[] images "이미지 URL 배열"
        DateTime created_at
        DateTime updated_at
    }

    Likes{
        Int id PK
        Int articleId FK
        Int authorId FK
        DateTime created_at
        %% UK: [authorId, articleId] 중복 방지
    }

    ArticleComments {
        Int id PK
        Int articleId FK
        Int authorId FK
        String content
        DateTime created_at
        DateTime updated_at
    }

    %% 유저 - 인증
    Users ||--o| UserCredential : "1:0..1 (이메일 사용자만)"
    Users ||--o{ SocialAccounts : "1:N (소셜 계정)"
    Users ||--o{ Token : "1:N (다중 기기)"

    %% 유저 - 작성 활동
    Users ||--o{ Products : "판매글 작성"
    Users ||--o{ ProductComments : "상품 댓글 작성"
    Users ||--o{ Favorites : "상품 찜하기"

    Users ||--o{ Articles : "게시글 작성"
    Users ||--o{ ArticleComments : "게시글 댓글 작성"
    Users ||--o{ Likes : "게시글 좋아요"

    %% 상품 관계
    Products ||--o{ Favorites : "N명이 찜함"
    Products ||--o{ ProductComments : "N개 댓글"
    Products ||--o{ PriceHistory : "has"
    %% 카테고리 관계
    Products ||--|| Categories : "belongs to"
    %% 상태 관계
    Products ||--|| Status : "belongs to"

    %% 게시글 관계
    Articles ||--o{ Likes : "N명이 좋아요"
    Articles ||--o{ ArticleComments : "N개 댓글"
```
