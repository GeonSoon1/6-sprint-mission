BEGIN;

-- 더미 데이터 (Dummy Data) --

-- 1. 참조되는 테이블 데이터 먼저 추가
INSERT INTO users (nickname) VALUES ('user1'), ('user2'), ('user3'), ('user4');
INSERT INTO categories (name) VALUES ('디지털/가전'), ('가구/인테리어'), ('유아동');
INSERT INTO status (name) VALUES ('판매중'), ('예약중'), ('판매완료');

-- UserCredentials 데이터 추가 (user1, user2에 대한 이메일/비밀번호 로그인 정보)
-- 실제 애플리케이션에서는 비밀번호를 해시(hash)하여 저장
INSERT INTO user_credentials (user_id, email, password) VALUES
(1, 'user1@example.com', 'password123'), (2, 'user2@example.com', 'password123');

-- 2. 위에서 생성된 데이터를 참조하는 테이블 데이터 추가
-- author_id: 1 ('user1'), category_id: 1 ('디지털/가전'), status_id: 1 ('판매중')
INSERT INTO products (
  author_id,
  category_id,
  status_id,
  name,
  description,
  price,
  tags
)
VALUES
(1, 1, 1, '맥북 프로 16인치', 'M1 Max 칩셋, 32GB RAM, 1TB SSD 모델입니다. 상태 아주 좋아요.', 2800000, ARRAY['애플', '노트북', '전문가용']),
(2, 2, 1, '이케아 3인용 소파', '이사가게 되어서 팝니다. 1년 사용했어요.', 150000, ARRAY['가구', '소파', '이케아']),
(3, 1, 2, '소니 헤드셋 WH-1000XM5', '노이즈 캔슬링 최고입니다. 박스 풀셋.', 350000, ARRAY['전자기기', '헤드셋', '소니']),
(1, 3, 1, '유아용 자전거', '아이가 커서 안 타네요. 상태 양호합니다.', 50000, ARRAY['유아동', '자전거', '장난감']);

-- Favorites 데이터 추가
INSERT INTO favorites (author_id, product_id) VALUES
(1, 2), -- user1이 product2(이케아 소파) 좋아요
(1, 3), -- user1이 product3(소니 헤드셋) 좋아요
(2, 1); -- user2가 product1(맥북) 좋아요

COMMIT;
