/*
  - "판다마켓 디자인"을 바탕으로 필요한 스키마를 설계
  - SQL CREATE TABLE 문법을 사용해 테이블을 생성하는 코드로 설계
*/

-- User 모델
CREATE TABLE users (
    -- 컬럼 작성
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    nickname VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,  
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Product 모델 
-- image를 1개만 사용해서 모델 확장을 하지 않았습니다.
-- 필요하다면 추가 구현 하겠습니다.
CREATE TABLE products (
    -- 컬럼 작성
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,

    image TEXT NOT NULL,
    name VARCHAR(10) NOT NULL,
    description TEXT NOT NULL,
    price INT NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    -- 제약 사항
    CONSTRAINT description_length CHECK (LENGTH(description) >= 10), 
    CONSTRAINT price_min CHECK (price >= 0),

    -- 관계형 데이터 선언
    FOREIGN KEY (user_id) REFERENCES users (id)
);


-- Article 모델
CREATE TABLE articles (
    -- 컬럼 작성
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,

    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT, 

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    -- 관계형 데이터 선언
    FOREIGN KEY (user_id) REFERENCES users (id)
);


-- Product 관련 Tag / Comment / Like Count 모델 

-- Tag 모델
CREATE TABLE tags (
    -- 컬럼 작성
    id SERIAL PRIMARY KEY, 
    tag VARCHAR(20) NOT NULL UNIQUE,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tag 기록 모델
CREATE TABLE product_tags (
    -- 컬럼 작성
    product_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- 중복 자체를 구조적으로 막기 위해 product_id & tag_id 조합으로 PK 생성
    PRIMARY KEY (product_id, tag_id), 

    -- 관계형 데이터 선언
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
);

-- comment 모델
-- 사용자가 댓글을 여러 개 남길 수 있어서 id를 PK로 지정 했습니다
CREATE TABLE product_comments (
    -- 컬럼 작성
    id SERIAL PRIMARY KEY,    
    user_id INTEGER  NOT NULL,
    product_id INTEGER NOT NULL,

    content TEXT NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- 관계형 데이터 선언
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE Cascade,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE Cascade
);

-- likes 모델
-- 사용자는 제품 하나당 1번의 좋아요만 남길 수 있도록 
-- PK를 (user_id, product_id) 조합으로 지정 했습니다.
CREATE TABLE product_likes(
    -- 컬럼 작성
    user_id INTEGER  NOT NULL,
    product_id INTEGER NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- 관계형 데이터 선언
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE Cascade,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE Cascade
);

-- Article 관련 Comment / Like Count 모델 
-- comment 모델
-- 사용자가 댓글을 여러 개 남길 수 있어서 id를 PK로 지정 했습니다
CREATE TABLE article_comments (
    -- 컬럼 작성
    id SERIAL PRIMARY KEY,    
    user_id INTEGER  NOT NULL,
    article_id INTEGER NOT NULL,
    content TEXT NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- 관계형 데이터 선언
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE Cascade,
    FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE Cascade
);

-- likes 모델
-- 사용자는 제품 하나당 1번의 좋아요만 남길 수 있도록 
-- PK를 (user_id, product_id) 조합으로 지정 했습니다.
CREATE TABLE article_likes(
    -- 컬럼 작성 
    user_id INTEGER NOT NULL,
    article_id INTEGER NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- 관계형 데이터 선언
    PRIMARY KEY (user_id, article_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE Cascade,
    FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE Cascade
);