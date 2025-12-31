BEGIN;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT now()
); 
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(19, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    UNIQUE(user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

INSERT INTO users (nickname, email, password_hash) VALUES
('user1', 'user1@example.com', 'hashed_password_1'),
('user2', 'user2@example.com', 'hashed_password_2'),
('user3', 'user3@example.com', 'hashed_password_3'),
('user4', 'user4@example.com', 'hashed_password_4'),
('user5', 'user5@example.com', 'hashed_password_5'),
('user6', 'user6@example.com', 'hashed_password_6'),  
('user7', 'user7@example.com', 'hashed_password_7'),
('user8', 'user8@example.com', 'hashed_password_8'),
('user9', 'user9@example.com', 'hashed_password_9'),
('user10', 'user10@example.com', 'hashed_password_10');

INSERT INTO products (user_id, name, description, price) VALUES
(1, 'Product A', 'Description for Product A', 5000),
(1, 'Product B', 'Description for Product B', 4500),
(2, 'Product C', 'Description for Product C', 12000),
(3, 'Product D', 'Description for Product D', 1000),
(1, '팬더마켓 E', '거저다 거저', 5000),
(2, '푸바오 인형 F', '너무 귀여워요', 8500),
(3, '상품 G', '싸게 드릴게', 7500),
(4, '테스트 H', '테스트 설명입니다.', 2000),
(5, '볼펜 I', '필기감 장난 아님', 3000),
(1, '필통 J', '필통이 이렇게 크다고?', 2500),
(2, '맥북 K', '맥북 팝니다.', 100000),
(3, '맥북 에어 L', '맥북 에어가 더 좋지', 350000);

INSERT INTO likes (user_id, product_id) VALUES
(2, 1),
(1, 3),
(3, 1),
(1, 5),
(2, 6),
(1, 8),
(4, 1),
(1, 10),
(2, 11),
(1, 12),
(5, 2),
(6, 3),
(7, 4),
(8, 5),
(9, 6),
(10, 7),
(3, 4),
(5, 6),
(7, 8);

INSERT INTO comments (user_id, product_id, content, created_at) VALUES
(1, 2, '이 상품 정말 좋아요!', '2025-01-01 10:00:00'),
(2, 1, '괜찮은 상품이네요.', '2025-01-01 11:00:00'),
(1, 3, '가격이 좀 비싼 것 같아요.', '2025-01-01 12:00:00'),
(3, 1, '배송이 빨라서 좋았습니다.', '2025-01-01 13:00:00'),
(1, 5, '다시 사고 싶은 상품입니다.', '2025-05-01 14:00:00'),
(2, 6, '품질이 기대 이상이에요.', '2025-03-01 15:00:00'),
(1, 8, '친구에게 추천했어요.', '2025-04-01 16:00:00'),
(4, 1, '사용해보니 만족스럽네요.', '2025-01-01 17:00:00'),
(1, 10, '디자인이 정말 예뻐요.', '2025-11-01 18:00:00'),
(2, 11, '다음에도 또 구매할게요.', '2025-12-01 19:00:00'),
(1, 12, '최고의 상품입니다!', '2025-06-01 20:00:00');

COMMIT;