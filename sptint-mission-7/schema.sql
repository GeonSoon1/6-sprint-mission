-- Active: 1765273146572@@127.0.0.1@5432@express_user_system
-- =========================
-- 태그
-- =========================
CREATE TYPE tag AS ENUM (
  'NONE',
  'FASHION',
  'BEAUTY',
  'SPORTS',
  'ELECTRONICS',
  'HOME_INTERIOR',
  'HOUSEHOLD_SUPPLIES',
  'KITCHENWARE'
);

-- =========================
-- 유저
-- =========================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  nickname VARCHAR(100) NOT NULL,
  image TEXT,
  password TEXT NOT NULL,
  refesh_token TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- 상품
-- =========================
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  tag TAG DEFAULT 'NONE',
  image_path TEXT,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_product_user
    FOREIGN KEY(user_id)
      REFERENCES users(id)
      ON DELETE CASCADE
);

-- =========================
-- 게시글
-- =========================
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_article_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- =========================
-- 게시글 댓글
-- =========================
CREATE TABLE article_comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  article_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_article_comment_article
    FOREIGN KEY (article_id)
    REFERENCES articles(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_article_comment_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- =========================
-- 상품 댓글
-- =========================
CREATE TABLE product_comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_product_comment_product
    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_product_comment_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- =========================
-- 구매 기록
-- =========================
CREATE TABLE purchases (
  id SERIAL PRIMARY KEY,
  quantity INT NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_purchase_product
    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE CASCADE
);

-- =========================
-- 상품 좋아요
-- =========================
CREATE TABLE product_likes (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  CONSTRAINT fk_product_like_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_product_like_product
    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE CASCADE,
  CONSTRAINT uq_product_like UNIQUE (user_id, product_id)
);

-- =========================
-- 게시글 좋아요
-- =========================
CREATE TABLE article_likes (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  article_id INT NOT NULL,
  CONSTRAINT fk_article_like_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_article_like_article
    FOREIGN KEY (article_id)
    REFERENCES articles(id)
    ON DELETE CASCADE,
  CONSTRAINT uq_article_like UNIQUE (user_id, article_id)
);