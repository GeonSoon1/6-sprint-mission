-- =========================
-- 태그
-- =========================
CREATE TYPE role AS ENUM ('USER', 'ADMIN');

-- =========================
-- 유저
-- =========================
CREATE TABLE "USER" (
id SERIAL PRIMARY KEY,
email VARCHAR(255) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
nickname VARCHAR(255) UNIQUE NOT NULL,
profile_image VARCHAR(255),
refresh_token VARCHAR(255),
role role DEFAULT 'USER',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 카테고리
-- =========================
CREATE TABLE "Category" (
id SERIAL PRIMARY KEY,
name VARCHAR(100) UNIQUE NOT NULL
);

-- =========================
-- 상품
-- =========================
CREATE TABLE "Product" (
id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
description TEXT NOT NULL,
price INT NOT NULL,
images TEXT[],
tags TEXT[],
image_url VARCHAR(255),
seller_id INT
user_id INT NOT NULL,
category_id INT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT fk_product_user
FOREIGN KEY (user_id) REFERENCES "USER" (id) ON DELETE CASCADE,

CONSTRAINT fk_product_category
FOREIGN KEY (category_id) REFERENCES "Category" (id)
);

-- =========================
-- 상품 댓글 
-- =========================
CREATE TABLE "ProductComment" (
id SERIAL PRIMARY KEY, 
content TEXT NOT NULL,
product_id INT NOT NULL,
user_id INT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT fk_product_comment_product
FOREIGN KEY (product_id) REFERENCES "Product" (id) ON DELETE CASCADE,

CONSTRAINT fk_product_comment_user
FOREIGN KEY (user_id) REFERENCES "USER" (id) ON DELETE CASCADE
);

-- =========================
-- 상품 좋아요
-- =========================
CREATE TABLE "ProductLike" (
id SERIAL PRIMARY KEY,
product_id INT NOT NULL,
user_id INT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT fk_product_like_product
  FOREIGN KEY (product_id) REFERENCES "Product" (id) ON DELETE CASCADE,

CONSTRAINT fk_product_like_user
  FOREIGN KEY (user_id) REFERENCES "USER" (id) ON DELETE CASCADE,

CONSTRAINT unique_product_like UNIQUE (product_id, user_id)
);

-- =========================
-- 게시글 
-- =========================
CREATE TABLE "Article" (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_article_user
  FOREIGN KEY (user_id) REFERENCES "USER" (id) ON DELETE CASCADE
);

-- =========================
-- 게시글 댓글
-- =========================
CREATE TABLE "ArticleComment" (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  article_id INT NOT NULL,
  user_id INT NOT NULL,
  parent_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_article_comment_article
  FOREIGN KEY (article_id) REFERENCES "Article" (id) ON DELETE CASCADE,
  
  CONSTRAINT fk_article_comment_user
  FOREIGN KEY (user_id) REFERENCES "USER" (id) ON DELETE CASCADE,
  
  CONSTRAINT fk_article_comment_parent
  FOREIGN KEY (parent_id) REFERENCES "ArticleComment" (id)
);

-- =========================
-- 게시글 좋아요  
-- =========================
CREATE TABLE "ArticleLike" (
    id SERIAL PRIMARY KEY,
    article_id INT NOT NULL,
    user_id INT NOT NULL,

    CONSTRAINT fk_article_like_article
    FOREIGN KEY (article_id) REFERENCES "Article" (id) ON DELETE CASCADE,

    CONSTRAINT fk_article_user_article
    FOREIGN KEY (user_id) REFERENCES "USER" (id) ON DELETE CASCADE,

    CONSTRAINT unique_article_like UNIQUE (article_id, user_id)
);

-- =========================
-- 알림/공지 
-- =========================
CREATE TABLE "Notification" (
  id VARCHAR(100) PRIMARY KEY,
  user_id INT
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ALTER TABLE "Notification"
ADD CONSTRAINT fk_notification_user
FOREIGN KEY (user_id) REFERENCES "USER"(id) ON DELETE CASCADE;
);

-- =========================
-- 포스트(독립 테이블)
-- =========================
CREATE TABLE "Post" (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id INT
  created_at TIMESTAMP
  updated_at TIMESTAMP
ALTER TABLE "Post"
ADD CONSTRAINT fk_post_user
FOREIGN KEY (author_id) REFERENCES "USER"(id) ON DELETE SET NULL;
);
