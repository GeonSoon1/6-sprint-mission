-- DB 생성
--CREATE DATABASE MARKETDB;

--TABLE 생성

--user tables

CREATE TABLE users_TB (
    id SERIAL PRIMARY KEY,
    nickname TEXT UNIQUE NOT NULL,
    createdAt DATE,
    updatedAt DATE,
    deletedAt DATE
);

CREATE TABLE user_credentials_TB (
    id SERIAL PRIMARY KEY,
    userId INT NOT NULL,
    email TEXT UNIQUE,
    password TEXT,
    updatedAT DATE,
    FOREIGN KEY (userId) REFERENCES users_TB(id) ON DELETE CASCADE
);

CREATE TABLE social_accounts_TB (
    id SERIAL PRIMARY KEY,
    userId INT NOT NULL,
    provider TEXT,
    providerId TEXT,
    createdAt DATE,
    updatedAt DATE,
    FOREIGN KEY (userId) REFERENCES users_TB(id) ON DELETE CASCADE
);

CREATE TABLE token_TB (
    id SERIAL PRIMARY KEY,
    userId INT NOT NULL,
    refreshToken TEXT UNIQUE,
    userAgent TEXT,
    expiresAt DATE,
    createdAt DATE,
    FOREIGN KEY (userId) REFERENCES users_TB(id) ON DELETE CASCADE
);

--product tables

CREATE TABLE products_TB (
    id SERIAL PRIMARY KEY,
    authorId INT NOT NULL,
    name VARCHAR(10) NOT NULL,
    description TEXT NOT NULL,
    price INT NOT NULL,
    image TEXT,
    tags VARCHAR(5)[],
    createdAt DATE,
    updatedAt DATE,
    deleteAt DATE,
    FOREIGN KEY (authorId) REFERENCES users_TB(id) ON DELETE CASCADE
);

CREATE TABLE priceHistory_TB(
    id SERIAL PRIMARY KEY,
    productId INT NOT NULL,
    price INT NOT NULL,
    createAt DATE,
    FOREIGN KEY (productId) REFERENCES products_TB(id) ON DELETE CASCADE
);

CREATE TABLE categories_TB (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE
);

CREATE TABLE status_TB (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE
);

CREATE TABLE favorites_TB (
    id SERIAL PRIMARY KEY,
    productId INT NOT NULL,
    authorId INT NOT NULL,
    createdAt DATE,
    FOREIGN KEY (productId) REFERENCES products_TB(id) ON DELETE CASCADE,
    FOREIGN KEY (authorId) REFERENCES users_TB(id) ON DELETE CASCADE,
    UNIQUE(productId, authorId)
);

CREATE TABLE productComments_TB (
    id SERIAL PRIMARY KEY,
    productId INT NOT NULL,
    authorId INT NOT NULL,
    content TEXT NOT NULL,
    createdAt DATE,
    updatedAt DATE,
    deletedAt DATE,
    FOREIGN KEY (productId) REFERENCES products_TB(id) ON DELETE CASCADE,
    FOREIGN KEY (authorId) REFERENCES users_TB(id) ON DELETE CASCADE
);

--article tables

CREATE TABLE articles_TB (
    id SERIAL PRIMARY KEY,
    authorId INT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    viewCount INT,
    images TEXT[],
    createdAt DATE,
    updatedAt DATE,
    deletedAt DATE,
    FOREIGN KEY (authorId) REFERENCES users_TB(id) ON DELETE CASCADE
);

CREATE TABLE likes_TB(
    id SERIAL PRIMARY KEY,
    articleId INT NOT NULL,
    authorId INT NOT NULL,
    createdAt DATE,
    FOREIGN KEY (articleId) REFERENCES articles_TB(id) ON DELETE CASCADE,
    FOREIGN KEY (authorId) REFERENCES users_TB(id) ON DELETE CASCADE,
    UNIQUE(productId, authorId)
);

CREATE TABLE articleComments_TB (
    id SERIAL PRIMARY KEY,
    articleId INT NOT NULL,
    authorId INT NOT NULL,
    content text NOT NULL,
    createdAt DATE,
    updatedAt DATE,
    deletedAt DATE,
    FOREIGN KEY (articleId) REFERENCES articles_TB(id) ON DELETE CASCADE,
    FOREIGN KEY (authorId) REFERENCES users_TB(id) ON DELETE CASCADE
);

--seed 데이터 삽입

INSERT INTO users_TB (nickname, createdAt)
VALUES ('김붕어', '2010-10-23');
INSERT INTO users_TB (nickname, createdAt)
VALUES ('빵상', '2013-11-09');
INSERT INTO users_TB (nickname, createdAt)
VALUES ('황근출', '2020-01-12');
INSERT INTO users_TB (nickname, createdAt)
VALUES ('김수한무거북이와두루미', '2025-12-19');

INSERT INTO user_credentials_TB (userId, email, password)
VALUES (1, 'fish@naver.com', '12345');
INSERT INTO user_credentials_TB (userId, email, password)
VALUES (2, 'iloveufo@daum.net', '0003');
INSERT INTO user_credentials_TB (userId, email, password)
VALUES (3, 'marine@gmail.com', '4679');
INSERT INTO user_credentials_TB (userId, email, password)
VALUES (4, 'longlive@yahoo.com', '30000');

INSERT INTO products_TB (authorId, name, description, price, image, tags, createdAt)
VALUES (1, '중고 테블릿', '모서리 나간 테블릿 팔아요. 성능엔 문제 없어요.', 20000, 'tablet.png', '{"전자기기", "중고", "테블릿"}', '2015-03-23');
INSERT INTO products_TB (authorId, name, description, price, image, tags, createdAt)
VALUES (1, '꽃화분', '이쁜 꽃화분 팝니다', 4000, 'pot.png', '{"화분", "중고"}', '2015-05-10');
INSERT INTO products_TB (authorId, name, description, price, image, tags, createdAt)
VALUES (1, '머그컵', '브렌드 머그컵 팝니다', 1500000, 'mugcup.png', '{"컵", "중고", "브렌드", "고급"}', '2020-04-20');

INSERT INTO products_TB (authorId, name, description, price, image, tags, createdAt)
VALUES (1, '명품 옷', '사이즈 안맞아서 부띠끄 드레스 팔아요', 200000000, 'dress.png', '{"옷", "드레스", "명품", "OO디자인", "중고"}', '2020-05-23');

INSERT INTO products_TB (authorId, name, description, price, image, tags, createdAt)
VALUES (3, '텐트', '캠핑 그만둡니다. 텐트 팔아요', 100000, 'camptent.png', '{"중고", "텐트", "아웃도어", "캠핑", "캠핑장비"}', '2020-01-13');
INSERT INTO products_TB (authorId, name, description, price, image, tags, createdAt)
VALUES (3, '가스버너', '캠핑 그만둡니다. 버너 팔아요', 30000, 'burner.png', '{"중고", "버너", "아웃도어", "캠핑", "캠핑장비"}', '2020-02-13');
INSERT INTO products_TB (authorId, name, description, price, image, tags, createdAt)
VALUES (3, '침낭', '캠핑 그만둡니다. 침낭 팔아요', 50000, 'burner.png', '{"중고", "침낭", "아웃도어", "캠핑", "캠핑장비"}', '2020-03-13');
INSERT INTO products_TB (authorId, name, description, price, image, tags, createdAt)
VALUES (3, '접이식 의자', '캠핑 그만둡니다. 의자 팔아요', 30000, 'chair.png', '{"중고", "의자", "접이식", "아웃도어", "캠핑", "캠핑장비"}', '2020-04-13');
INSERT INTO products_TB (authorId, name, description, price, image, tags, createdAt)
VALUES (3, '휴대용 난로', '캠핑 그만둡니다. 난로 팔아요', 100000, 'heater.png', '{"중고", "난로", "휴대용", "아웃도어", "캠핑", "캠핑장비"}', '2021-01-13');
INSERT INTO products_TB (authorId, name, description, price, image, tags, createdAt)
VALUES (3, '대형 베터리', '캠핑 그만둡니다. 대용량 베터리 팔아요', 50000, 'battery.png', '{"중고", "베터리", "대용량", "휴대용", "아웃도어", "캠핑", "캠핑장비"}', '2021-03-12');
INSERT INTO products_TB (authorId, name, description, price, image, tags, createdAt)
VALUES (3, '코펠세트', '캠핑 그만둡니다. 코펠 조리도구 팔아요', 30000, 'burner.png', '{"중고", "코펠", "조리도구", "스뎅", "아웃도어", "캠핑", "캠핑장비"}', '2025-11-12');

INSERT INTO productComments_TB (productId, authorId, content, createdAt)
VALUES (1, 2, '기기 기종은 어떻게 되나요?', '2025-01-10');
INSERT INTO productComments_TB (productId, authorId, content, createdAt)
VALUES (1, 3, '너무 비싸네요', '2025-02-10');
INSERT INTO productComments_TB (productId, authorId, content, createdAt)
VALUES (1, 2, '혹시 팔렸나요?', '2025-03-25');
INSERT INTO productComments_TB (productId, authorId, content, createdAt)
VALUES (1, 4, '네고 가능?', '2025-04-10');

INSERT INTO productComments_TB (productId, authorId, content, createdAt)
VALUES (2, 2, '저기 금간거 같은데요?', '2025-03-12');
INSERT INTO productComments_TB (productId, authorId, content, createdAt)
VALUES (2, 4, '님들 저거 다이소가면 1000원에 팔아요', '2025-04-11');

INSERT INTO productComments_TB (productId, authorId, content, createdAt)
VALUES (4, 3, '이쁜데 혹시 어께사이즈 110도 입을 수 있나요?', '2020-03-11');

INSERT INTO productComments_TB (productId, authorId, content, createdAt)
VALUES (10, 1, '용량수치는 어느정도 되나요?', '2024-01-03');
INSERT INTO productComments_TB (productId, authorId, content, createdAt)
VALUES (10, 4, '무게는 어느정도 됨?', '2025-03-23');
INSERT INTO productComments_TB (productId, authorId, content, createdAt)
VALUES (10, 4, '운영자 측에서 삭제된 댓글입니다', '2025-06-12');
INSERT INTO productComments_TB (productId, authorId, content, createdAt)
VALUES (9, 2, '전기 소모량은 어느정도나요', '2025-03-11');
INSERT INTO productComments_TB (productId, authorId, content, createdAt)
VALUES (9, 3, '빵상님 완충하면 3일은 갑니다', '2025-03-14');

INSERT INTO productComments_TB (productId, authorId, content, createdAt)
VALUES (5, 1, '찢어진데는 없나요', '2025-11-11');
INSERT INTO productComments_TB (productId, authorId, content, createdAt)
VALUES (5, 1, '네고 가능?', '2025-12-12');