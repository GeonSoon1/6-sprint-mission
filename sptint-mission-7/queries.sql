/*
  다음 경우들에 대해 총 14개의 SQL 쿼리를 작성해 주세요.
  예시로 값이 필요한 경우 적당한 값으로 채워넣어서 작성하면 됩니다. 
*/
INSERT INTO users (id, email, nickname, password)
VALUES (1, 'leon@example.com', 'user1', 'password123')
ON CONFLICT (id) DO NOTHING;

/*
  1. 내 정보 업데이트 하기
  - 닉네임을 "test"로 업데이트
  - 현재 로그인한 유저 id가 1이라고 가정
*/
UPDATE users
SET nickname = 'test',
    updated_at = NOW()
WHERE id = 1;

/*
  2. 내가 생성한 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT * FROM products
WHERE user_id = 1
ORDER BY created_at DESC
LIMIT 10 OFFSET 20;

/*
  3. 내가 생성한 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/
SELECT COUNT(*) AS total_count
FROM products
WHERE user_id = 1; 

/*
  4. 내가 좋아요 누른 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT p.*
FROM products p
JOIN product_likes pl ON p.id = pl.product_id
WHERE pl.user_id = 1
ORDER BY pl.id DESC
LIMIT 10 OFFSET 20;

/*
  5. 내가 좋아요 누른 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/
SELECT COUNT(*) AS total_count
FROM product_likes
WHERE user_id = 1; 

/*
  6. 상품 생성
  - 현재 로그인한 유저 id가 1이라고 가정
*/
INSERT INTO products (name, description, price, tag, image_path, user_id)
VALUES ('test', 'description.', 7000, 'ELECTRONICS', '/images/sample-product.jpg', 1);


/*
  7. 상품 목록 조회
  - 상품명에 "test"가 포함된 상품 검색
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 1번째 페이지
  - 각 상품의 좋아요 개수를 포함해서 조회하기
*/
SELECT p.*, 
       (SELECT COUNT(*) FROM product_likes pl WHERE pl.product_id = p.id)
       AS like_count
FROM products p
WHERE p.name ILIKE '%test%'
ORDER BY p.created_at DESC
LIMIT 10 OFFSET 0;

/*
  8. 상품 상세 조회
  - 1번 상품 조회
*/
SELECT p.*, 
       (SELECT COUNT(*) FROM product_likes pl WHERE pl.product_id = p.id)
       AS like_count
FROM products p
WHERE p.id = 1; 

/*
  9. 상품 정보 수정
  - 1번 상품 수정
*/
UPDATE products
SET name = 'test',
    description = 'leon product',
    price = 1000000,
    tag = 'SPORTS',
    image_path = '/images/updated-product.jpg',
    updated_at = NOW()
WHERE id = 1; 

/*
  10. 상품 삭제
  - 1번 상품 삭제
*/
DELETE FROM products
WHERE id = 1;

/*
  11. 상품 좋아요
  - 1번 유저가 2번 상품 좋아요
*/
INSERT INTO product_likes (user_id, product_id)
VALUES (1, 2);

/*
  12. 상품 좋아요 취소
  - 1번 유저가 2번 상품 좋아요 취소
*/
DELETE FROM product_likes
WHERE user_id = 1 AND product_id = 2;


/*
  13. 상품 댓글 작성
  - 1번 유저가 2번 상품에 댓글 작성
*/
INSERT INTO product_comments (content, product_id, user_id)
VALUES ('Great product!', 2, 1);


/*
  14. 상품 댓글 조회
  - 1번 상품에 달린 댓글 목록 조회
  - 최신 순으로 정렬
  - 댓글 날짜 2025-03-25 기준일을 제외한 이전 데이터 10개
*/
SELECT * FROM product_comments
WHERE product_id = 1 AND created_at < '2025-03-25'
ORDER BY created_at DESC 
LIMIT 10; 