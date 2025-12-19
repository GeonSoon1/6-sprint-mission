-- user data
INSERT INTO users (email, nickname, password)
VALUES
    ('user01@test.com', '코딩토끼', 'password01'),
    ('user02@test.com', '디버그곰', 'password02'),
    ('user03@test.com', '쿼리여우', 'password03'),
    ('user04@test.com', '백엔드냥', 'password04'),
    ('user05@test.com', '프론트독', 'password05'),
    ('user06@test.com', '노드판다', 'password06'),
    ('user07@test.com', '프리즈마캣', 'password07'),
    ('user08@test.com', '리액트펭귄', 'password08'),
    ('user09@test.com', 'SQL너구리', 'password09'),
    ('user10@test.com', '서버햄스터', 'password10');

-- products data
INSERT INTO products (user_id, image, name, description, price)
VALUES
    (1, 'img_umbrella.jpg', '사계절 우산', '비와 햇빛 모두 막아주는 실속형 우산', 15000),
    (2, 'img_sandal.jpg', '여름 샌들', '물놀이에 적합한 가벼운 샌들', 29000),
    (3, 'img_padding.jpg', '겨울 패딩', '한겨울에도 따뜻한 방한 패딩', 129000),
    (4, 'img_mat.jpg', '캠핑 매트', '야외 활동에 최적화된 방수 매트', 45000),
    (5, 'img_baby_hat.jpg', '유아 모자', '사계절 사용 가능한 유아용 모자', 18000);


-- tags data
INSERT INTO tags (tag)
VALUES ('봄'), ('여름'), ('가을'), ('겨울'), ('물놀이'),('야외'),('실내'),('방한용품'),('성인용'),('유아용'),('사계절용'),('남자'),('여자');

-- product_tags data
INSERT INTO product_tags (product_id, tag_id)
VALUES 
    -- 사계절 우산
    (1, 11), (1, 6), (1, 9),

    -- 여름 샌들
    (2, 2), (2, 5), (2, 12), (2, 13),

    -- 겨울 패딩
    (3, 4), (3, 8), (3, 9), 

    -- 캠핑 매트
    (4, 6), (4, 11), (4, 9), 

    -- 유아 모자
    (5, 10), (5, 11), (5, 13);

-- product_comments data
INSERT INTO product_comments (user_id, product_id, content)
VALUES 
    (1, 1, '사계절용이라 활용도 진짜 좋아요'),
    (2, 1, '가방에 넣어도 부담 없는 느낌이에요'),
    (3, 2, '여름에 신기 딱 시원해 보입니다'),
    (4, 2, '물놀이 갔다가 미끄럽지 않아서 만족!'),
    (5, 3, '겨울에 입으니까 확실히 따뜻하네요'),
    (6, 3, '방한 제대로 됩니다. 바람 차단 굿'),
    (7, 4, '캠핑 갈 때 깔아보니 편했어요'),
    (8, 4, '야외에서 써도 튼튼해서 마음 놓입니다'),
    (9, 5, '유아용이라 착용감도 괜찮아 보여요'),
    (10, 5, '사계절 쓰기 좋아서 오래 쓸 듯!');

-- product_likes data
INSERT INTO product_likes (user_id, product_id)
VALUES (1, 1), (2, 1), (3, 2), (4, 2), (5, 3), (6, 3), (7, 4), (8, 4), (9, 5), (10, 5);


-- articles data
INSERT INTO articles (user_id, title, content)
VALUES
    (1, '사계절 제품 고를 때 제일 중요한 점', '계절 안 타고 오래 쓸 수 있는 제품이 결국 제일 만족도가 높더라고요.'),
    (2, '여름용 제품 사용 후기', '가볍고 통풍 잘 되는 게 최고입니다. 디자인도 중요하지만요.'),
    (3, '겨울 대비 아이템 추천', '방한은 무조건 과하지 않게, 실용성이 답인 것 같아요.'),
    (4, '야외 활동용 제품 고르는 팁', '내구성과 휴대성이 진짜 중요합니다. 직접 써보면 느껴져요.'),
    (5, '유아용 제품은 이걸 먼저 봅니다', '안전성과 소재가 제일 우선이에요. 가격은 그 다음!'),
    (6, '물놀이용 아이템 실패 안 하는 법', '미끄럼 방지 여부 꼭 확인하세요. 진짜 체감 큽니다.'),
    (7, '실내에서 쓰기 좋은 제품 이야기', '공간 차지 안 하고 정리 쉬운 게 최고입니다.'),
    (8, '사계절 활용 가능한 아이템 리뷰', '계절별로 애매한 날씨에 쓰기 딱 좋아요.'),
    (9, '성인용 제품 구매 기준 공유', '내구성 + 디자인 둘 다 놓치면 후회합니다.'),
    (10, '최근 가장 만족한 구매', '가격 대비 만족도가 높아서 재구매도 고민 중이에요.');

-- article_comments data
INSERT INTO article_comments (user_id, article_id, content)
VALUES 
    (1, 2, '여름 제품 고를 때 정말 공감되는 내용이에요'),
    (2, 3, '겨울 대비는 미리미리 하는 게 답이죠'),
    (3, 4, '야외 활동 자주 하시는 분들께 도움 될 글이네요'),
    (4, 5, '유아용 제품 고를 때 참고 많이 됐어요'),
    (5, 6, '물놀이용은 미끄럼 방지가 진짜 중요하죠'),
    (6, 7, '실내용 제품 기준 정리 잘 해주신 것 같아요'),
    (7, 8, '사계절용 아이템 찾고 있었는데 도움 됐습니다'),
    (8, 9, '성인용 제품 기준이 딱 현실적이네요'),
    (9, 10, '만족한 이유가 잘 느껴지는 글이에요'),
    (10, 1, '사계절 제품 얘기 공감하면서 읽었습니다');

-- article_likes data
INSERT INTO article_likes (user_id, article_id)
VALUES 
    (1, 1), (2, 1), (3, 3), (4, 2), (5, 2), (6, 4), (7, 8), (8, 10), (9, 10), (10, 1);