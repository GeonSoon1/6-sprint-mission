```mermaid
  erDiagram
    USER {
      Int id PK
      String email "UNIQUE"
      String nickname 
      String password
      DateTime createdAt
      DateTime updatedAt
    }

    PRODUCT {
      Int id PK
      String name 
      String description
      Float price
      String[] tags
      String imageUrl "nullable"
      DateTime createdAt
      DateTime updatedAt
      Int userId FK
    }

    ARTICLE {
      Int id PK
      String title 
      String content
      String imageUrl "nullable"
      DateTime createdAt
      DateTime updatedAt
      Int userId FK
    }

    COMMENT {
      Int id PK
      String content 
      DateTime createdAt
      DateTime updatedAt
      Int userId FK
      Int productId FK
      Int articleId FK
    }

    USER ||--o{ PRODUCT : "create"
    USER ||--o{ ARTICLE : "write"
    USER ||--o{ COMMENT : "write"

    PRODUCT ||--o{ COMMENT : "has"
    ARTICLE ||--O{ COMMENT : "has"