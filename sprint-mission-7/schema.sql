
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  nickname TEXT NOT NULL UNIQUE,
  image TEXT,
  password TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  tags TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  user_id BIGINT NOT NULL,
  CONSTRAINT fk_products_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE articles (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  user_id BIGINT NOT NULL,
  CONSTRAINT fk_article_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE comments (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  user_id BIGINT NOT NULL,
  product_id BIGINT,
  article_id BIGINT,

  CONSTRAINT fk_comments_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_comments_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_comments_article
    FOREIGN KEY (article_id) REFERENCES articles(id)
    ON DELETE CASCADE,

  CONSTRAINT chk_comment_target
    CHECK (
      (product_id IS NOT NULL AND article_id IS NULL)
      OR
      (product_id IS NULL AND article_id IS NOT NULL)
    )
);

CREATE TABLE product_likes (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_product_likes_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_product_likes_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE,

  CONSTRAINT unique_product_likes UNIQUE (user_id, product_id)
);

CREATE TABLE article_likes (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  article_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_article_likes_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_article_likes_article
    FOREIGN KEY (article_id) REFERENCES articles(id)
    ON DELETE CASCADE,

  CONSTRAINT unique_article_likes UNIQUE (user_id, article_id)
);
