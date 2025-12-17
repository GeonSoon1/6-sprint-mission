```mermaid
erDiagram
USERS {
int id PK
nickname @unique
created_at
updated_at
}

user_crsdentials{
id PK
userId FK
email @unique - 로그인ID
password
updated_at
}

SocialAccount{
id PK
userId FK
provider - google, kakao "kakao": Unknow word.
providerId
created_at
updated_at
}

Token{
id PK
user_id
refersh_token
userAgent - '기기정조'
expires_at - 유효기간
created_at
updated_at
}

---

Products{
id
name
description
price
image - 최대 1개만 등록 가능
tags
authorId
created_at
updated_at
}

Favorites{
id @unique
userId FK
productId FK
created_at
updated_at
}

ProductComment{
id
content
authorId FK
productId FK
created_at
updated_at
}

---

Articles{
id
title
content
images
authorId FK
created_at
updated_at
}

Likes{
id
userId Fk
created_at
updated_at
}

ArticleComments{
id
content
authorId FK
articleId FK
created_at
updated_at
}
```
