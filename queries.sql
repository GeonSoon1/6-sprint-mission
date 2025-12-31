/*
  다음 경우들에 대해 총 14개의 SQL 쿼리를 작성해 주세요.
  예시로 값이 필요한 경우 적당한 값으로 채워넣어서 작성하면 됩니다. 
*/

/*
  1. 내 정보 업데이트 하기
  - 닉네임을 "test"로 업데이트  
  - 현재 로그인한 유저 id가 1이라고 가정
*/
UPDATE users_TB
SET nickname = 'test'
WHERE id = 1;


/*
  2. 내가 생성한 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/

SELECT * 
FROM products_TB 
WHERE authorId = 1 
ORDER BY createdAt DESC
LIMIT 10
OFFSET 30;


/*
  3. 내가 생성한 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/

SELECT COUNT(*)
FROM products_TB
WHERE authorId = 1;


/*
  4. 내가 좋아요 누른 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT products_TB.name
FROM products_TB 
JOIN favorites_TB ON products_TB.id = favorites_TB.productId
WHERE favorites_TB.authorId = 1
ORDER BY favorites_TB.createdAt DESC
LIMIT 10
OFFSET 30;

/*
  5. 내가 좋아요 누른 상품의 총 개수
  - 현재 로그인한 유저 id가 1이라고 가정
*/
SELECT COUNT(*)
FROM favorites_TB
WHERE authorId = 1;

/*
  6. 상품 생성
  - 현재 로그인한 유저 id가 1이라고 가정
*/
INSERT INTO products_TB (authorId, name, description, price, image, tags) 
VALUES (1, '중고 노트북', '약간의 스크레치, 키보드 닮은 흔적, 그외의 깨끗함', 50000, 'laptop.png', ARRAY['노트북', '중고']);


/*
  7. 상품 목록 조회
  - 상품명에 "test"가 포함된 상품 검색
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 1번째 페이지
  - 각 상품의 좋아요 개수를 포함해서 조회하기
*/
SELECT products_TB.name, count(favorites_TB) AS favorite_num
FROM products_TB
LEFT JOIN favorites_TB ON products_TB.id = favorites_TB.productId
GROUP BY products_TB.id
HAVING products_TB.name LIKE '%test%'
ORDER BY products_TB.createdAt DESC
LIMIT 10;


/*
  8. 상품 상세 조회
  - 1번 상품 조회
*/

SELECT * 
FROM products_TB 
WHERE id = 1;


/*
  9. 상품 정보 수정
  - 1번 상품 수정
*/

UPDATE products_TB
SET name = '신품 노트북 팔아요', description = '박스개봉만 한 노트북이에요', price = 200000
WHERE id = 1;

/*
  10. 상품 삭제
  - 1번 상품 삭제
*/
DELETE FROM products_TB 
WHERE id = 1;


/*
  11. 상품 좋아요
  - 1번 유저가 2번 상품 좋아요
*/

INSERT INTO favorites_TB (productId, authorId)
VALUES (2, 1);


/*
  12. 상품 좋아요 취소
  - 1번 유저가 2번 상품 좋아요 취소
*/

DELETE FROM favorites_TB
WHERE productId = 2 AND authorId = 1;


/*
  13. 상품 댓글 작성
  - 1번 유저가 2번 상품에 댓글 작성
*/

INSERT INTO productComments_TB (productId, authorId, content)
VALUES (2, 1, '박스 개봉하면 신품이 아니라 중고 아니에요?');



/*
  14. 상품 댓글 조회
  - 1번 상품에 달린 댓글 목록 조회
  - 최신 순으로 정렬
  - 댓글 날짜 2025-03-25 기준일을 제외한 이전 데이터 10개
*/

SELECT * 
FROM productComments_TB 
WHERE productId = 1 AND createdAt < '2025-03-25' 
ORDER BY createdAt DESC
LIMIT 10;