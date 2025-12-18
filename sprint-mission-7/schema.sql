-- ============================================
-- 사용자 관련 테이블
-- ============================================

-- users 테이블: 사용자 정보
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(100) NOT NULL,
    profile_image_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- 인덱스 추가
    INDEX idx_email (email),
    INDEX idx_nickname (nickname),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 상품 관련 테이블
-- ============================================

-- products 테이블: 상품 정보
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    status ENUM('active','sold','hidden') NOT NULL DEFAULT 'active',
    price DECIMAL(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- 외래 키 제약조건
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- 인덱스 추가
    INDEX idx_user_id (user_id),
    INDEX idx_name (name),
    INDEX idx_price (price),
    INDEX idx_created_at (created_at),
    INDEX idx_name_created_at (name, created_at)
     ,INDEX idx_status (status)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 좋아요 관련 테이블
-- ============================================

-- likes 테이블: 상품 좋아요
CREATE TABLE likes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- 복합 유니크 제약조건 (중복 좋아요 방지)
    UNIQUE KEY uk_user_product (user_id, product_id),
    
    -- 외래 키 제약조건
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    
    -- 인덱스 추가
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 댓글 관련 테이블
-- ============================================

-- comments 테이블: 상품 댓글
CREATE TABLE comments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- 외래 키 제약조건
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    
    -- 인덱스 추가
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id),
    INDEX idx_created_at (created_at),
    INDEX idx_product_created (product_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 뷰 (Views) - 자주 사용되는 조인 쿼리 최적화
-- ============================================

-- 상품 좋아요 개수 뷰
CREATE VIEW product_like_counts AS
SELECT 
    p.id as product_id,
    COUNT(l.id) as like_count
FROM products p
LEFT JOIN likes l ON p.id = l.product_id
GROUP BY p.id;

-- ============================================
-- 트리거 (Triggers) - 데이터 무결성 보장
-- ============================================

DELIMITER //

-- 상품 생성 시 updated_at 자동 설정 트리거
CREATE TRIGGER products_before_insert
BEFORE INSERT ON products
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//

-- 상품 수정 시 updated_at 자동 설정 트리거
CREATE TRIGGER products_before_update
BEFORE UPDATE ON products
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//

-- 댓글 생성 시 updated_at 자동 설정 트리거
CREATE TRIGGER comments_before_insert
BEFORE INSERT ON comments
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//

-- 댓글 수정 시 updated_at 자동 설정 트리거
CREATE TRIGGER comments_before_update
BEFORE UPDATE ON comments
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//

DELIMITER ;

-- ============================================
-- 초기 데이터 (선택사항)
-- ============================================

-- 테스트용 사용자 데이터 (실제 운영 시 삭제 또는 암호화된 데이터 사용)
INSERT INTO users (email, password, nickname) VALUES
('test@example.com', 'hashed_password_here', 'test'),
('admin@example.com', 'hashed_password_here', 'admin');

-- ============================================
-- 성능 최적화를 위한 추가 인덱스
-- ============================================

-- 복합 인덱스 (자주 사용되는 조합)
ALTER TABLE products ADD INDEX idx_user_created (user_id, created_at);
ALTER TABLE comments ADD INDEX idx_user_created (user_id, created_at);
ALTER TABLE likes ADD INDEX idx_product_created (product_id, created_at);
