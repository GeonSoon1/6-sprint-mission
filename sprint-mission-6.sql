-- # 초급 문제

-- 1. `orders` 테이블에서 모든 주문을 조회하세요.
SELECT * FROM orders;


-- 2. `orders`테이블에서 `id` 가 `423`인 주문을 조회하세요.
SELECT * FROM orders WHERE id = 423 ;


-- 3. `orders` 테이블에서 총 주문 건수를 `total_orders`라는 이름으로 구하세요.
SELECT COUNT(*) AS total_orders FROM orders;


-- 4. `orders` 테이블에서 최신 순으로 주문을 조회하세요. (`date`, `time` 컬럼이 분리되어 있다는 점에 주의)
SELECT * 
FROM orders 
ORDER BY date DESC, time DESC;


-- 5. `orders` 테이블에서 오프셋 기반 페이지네이션된 목록을 조회합니다. 페이지 크기가 10이고 최신순일 때, 첫 번째 페이지를 조회하세요.
SELECT * 
FROM orders 
ORDER BY date DESC, time DESC 
LIMIT 10;


-- 6. `orders` 테이블에서 오프셋 기반 페이지네이션된 목록을 조회합니다. 페이지 크기가 10이고 최신순일 때 5번째 페이지를 조회하세요.
SELECT * 
FROM orders 
ORDER BY date DESC, time DESC 
LIMIT 10 OFFSET 40;


-- 7. `orders` 테이블에서 커서 페이지네이션된 목록을 조회합니다. 페이지 크기가 10이고 최신순일때, `id` 값을 기준으로 커서를 사용합시다. 커서의 값이 `42`일 때 다음 페이지를 조회하세요.
SELECT * 
FROM orders
WHERE id < 42 
ORDER BY id DESC LIMIT 10;


-- 8. `orders` 테이블에서 2025년 3월에 주문된 내역만 조회하세요.
SELECT * 
FROM orders 
WHERE date >= '2025-03-01' AND date < '2025-04-01';
-- SELECT * FROM orders WHERE date LIKE '2025-03-%'; 
--date 값은 날짜형 데이터라 문자형 데이터에 사용 가능한 LIKE가 안됨


-- 9. `orders` 테이블에서 2025년 3월 12일 오전에 주문된 내역만 조회하세요.
SELECT * 
FROM orders 
WHERE date = '2025-03-12' AND time < '12:00:00';



-- 10. `pizza_types` 테이블에서 이름에 'Cheese' 혹은 'Chicken'이 포함된 피자 종류를 조회하세요. (대소문자를 구분합니다)
SELECT * 
FROM pizza_types 
WHERE name LIKE '%Cheese%' OR name LIKE '%Chicken%';


-- # 중급 문제

-- 1. `order_details` 테이블에서 각 피자(`pizza_id`)별로 주문된 건 수(`order_id`)를 보여주세요.
SELECT 
    pizza_id,
    COUNT(order_id) AS order_count
FROM order_details
GROUP BY pizza_id; 



-- 2. `order_details` 테이블에서 각 피자(`pizza_id`)별로 총 주문 수량을 구하세요.
SELECT 
    pizza_id,
    SUM(quantity) AS total_quantity
FROM order_details
GROUP BY pizza_id; 



-- 3. `pizzas` 테이블에서 `price`의 크기가 20보다 큰 피자의 종류만 `order_details` 테이블에서 조회하세요. (힌트: 서브쿼리)
SELECT * 
FROM order_details
WHERE pizza_id in (
    SELECT id
    FROM pizzas
    WHERE price > 20
    )
ORDER BY id DESC;



-- 4. `orders` 테이블에서 각 날짜별 총 주문 건수를 `order_count` 라는 이름으로 계산하고, 하루 총 주문 건수가 80건 이상인 날짜만 조회한 뒤, 주문 건수가 많은 순서대로 정렬하세요.
SELECT 
    date,
    COUNT(id) AS order_count
FROM orders
GROUP BY date
HAVING COUNT(id) >= 80
ORDER BY COUNT(id) DESC; 




-- 5. `order_details` 테이블에서 피자별(`pizza_id`) 총 주문 수량이 10개 이상인 피자만 조회하고, 총 주문 수량 기준으로 내림차순 정렬하세요.
SELECT 
    pizza_id,
    SUM(quantity) AS total_quantity
FROM order_details
GROUP BY pizza_id
HAVING SUM(quantity) >= 10
ORDER BY total_quantity DESC; 



-- 6. `order_details` 테이블에서 피자별 총 수익을 `total_revenue` 라는 이름으로 구하세요. (수익 = `quantity * price`)
SELECT 
    order_details.pizza_id,
    SUM(order_details.quantity) AS total_quantity,
    SUM(order_details.quantity * pizzas.price) AS total_revenue
FROM order_details JOIN pizzas
ON pizzas.id = order_details.pizza_id
GROUP BY pizza_id, pizzas.price; 



-- 7. 날짜별로 피자 주문 건수(`order_count`)와 총 주문 수량(`total_quantity`)을 구하세요.

SELECT 
    orders.date,
    COUNT(order_details.order_id) AS total_orders,
    SUM(order_details.quantity) AS total_quantity
FROM order_details JOIN orders
ON orders.id = order_details.order_id
GROUP BY orders.date
ORDER BY orders.date DESC; 
-- 보기 좋게 하기 위해서 
-- total_orders = 오더 총 수량을 추가 데이터로 넣고
-- 최신 날짜 순으로 정렬 하였습니다.



-- # 고급 문제

/*
    1. 피자별(`pizzas.id` 기준) 판매 수량 순위에서 피자별 판매 수량 상위에 드는 베스트 피자를 10개를 조회해 주세요. `pizzas`의 모든 컬럼을 조회하면서 각 피자에 해당하는 판매량을 `total_quantity`라는 이름으로 함께 조회합니다.
        
        출력 예시:

        ```sql
            big_meat_s    | big_meat    | S    |    12 |           1914
            thai_ckn_l    | thai_ckn    | L    | 20.75 |           1410
            five_cheese_l | five_cheese | L    |  18.5 |           1409
            four_cheese_l | four_cheese | L    | 17.95 |           1316
            classic_dlx_m | classic_dlx | M    |    16 |           1181
            spicy_ital_l  | spicy_ital  | L    | 20.75 |           1109
            hawaiian_s    | hawaiian    | S    |  10.5 |           1020
            southw_ckn_l  | southw_ckn  | L    | 20.75 |           1016
            bbq_ckn_l     | bbq_ckn     | L    | 20.75 |            992
            bbq_ckn_m     | bbq_ckn     | M    | 16.75 |            956
        ```
*/

SELECT 
    pizzas.id,
    pizzas.type_id,
    pizzas.size,
    pizzas.price,
    SUM(order_details.quantity) AS total_quantity
FROM pizzas JOIN order_details
ON pizzas.id = order_details.pizza_id
GROUP BY pizzas.id
ORDER BY SUM(order_details.quantity) DESC LIMIT 10;



/*
    2. `orders` 테이블에서 2025년 3월의 일별 주문 수량을 `total_orders`라는 이름으로, 일별 총 주문 금액을 `total_amount`라는 이름으로 포함해서 조회하세요.
        
        출력 예시:
        
        ```sql
        2025-03-01 |           49 | 1598.5500011444092
        2025-03-02 |           58 |  2379.050001144409
        2025-03-03 |           53 | 2287.8999996185303
        2025-03-04 |           59 |  2444.300001144409
        2025-03-05 |           64 |  2350.650005340576
        ```
*/

-- 최종 답안
SELECT 
    orders.date,
    SUM(order_details.quantity) AS total_order,
    SUM(order_details.quantity * pizzas.price) AS total_amount
FROM orders
JOIN order_details ON orders.id = order_details.order_id
JOIN pizzas ON pizzas.id = order_details.pizza_id
WHERE orders.date BETWEEN '2025-03-01' AND '2025-03-31'
GROUP BY orders.date
ORDER BY orders.date ASC;

    
-- -- 오더 별 금액 
-- order_details.pizza_id * order_details.quantity * pizzas.price

-- SELECT 
--     order_details.order_id,
--     SUM(order_details.quantity * pizzas.price) AS amount
-- FROM order_details JOIN pizzas
-- ON pizzas.id = order_details.pizza_id
-- GROUP BY order_details.order_id
-- ORDER BY order_details.order_id ASC;
-- --  order_id |       amount       
-- -- ----------+--------------------
-- --         1 |              13.25
-- --         2 |                 92
-- --         3 |              37.25
-- --         4 |               16.5
-- --         5 |               16.5
-- --         6 |              24.75
-- --         7 |               12.5
-- --         8 |               12.5
-- --         9 |             143.25
-- --        10 |                 41

-- SELECT 
--     orders.id,
--     orders.date,
--     SUM(order_details.quantity * pizzas.price) AS amount
-- FROM order_details
-- JOIN orders ON orders.id = order_details.order_id
-- JOIN pizzas ON pizzas.id = order_details.pizza_id
-- GROUP BY order_details.order_id, orders.id
-- ORDER BY order_details.order_id ASC;

-- --   id   |    date    |       amount       
-- -- -------+------------+--------------------
-- --      1 | 2025-01-01 |              13.25
-- --      2 | 2025-01-01 |                 92
-- --      3 | 2025-01-01 |              37.25
-- --      4 | 2025-01-01 |               16.5
-- --      5 | 2025-01-01 |               16.5
-- --      6 | 2025-01-01 |              24.75
-- --      7 | 2025-01-01 |               12.5
-- --      8 | 2025-01-01 |               12.5
-- --      9 | 2025-01-01 |             143.25
-- --     10 | 2025-01-01 |                 41

-- SELECT 
--     orders.date,
--     SUM(order_details.quantity) AS total_order,
--     SUM(order_details.quantity * pizzas.price) AS total_amount
-- FROM orders
-- JOIN order_details ON orders.id = order_details.order_id
-- JOIN pizzas ON pizzas.id = order_details.pizza_id
-- GROUP BY orders.date
-- ORDER BY orders.date ASC;

-- --     date    | total_order |    total_amount    
-- -- ------------+-------------+--------------------
-- --  2025-01-01 |         162 | 2713.8500022888184
-- --  2025-01-02 |         165 |  2731.900001525879
-- --  2025-01-03 |         158 | 2662.4000034332275
-- --  2025-01-04 |         106 | 1755.4500007629395
-- --  2025-01-05 |         125 | 2065.9500007629395
-- --  2025-01-06 |         147 |  2428.950002670288
-- --  2025-01-07 |         138 | 2202.2000007629395
-- --  2025-01-08 |         173 | 2838.3500061035156
-- --  2025-01-09 |         127 |  2127.35000419616




/*
    3. `order`의 `id`가 78에 해당하는 주문 내역들을 조회합니다. 주문 내역에서 각각 주문한 피자의 이름을 `pizza_name`, 피자의 크기를 `pizza_size`, 피자 가격을 `pizza_price`, 수량을 `quantity`, 각 주문 내역의 총 금액을 `total_amount` 라는 이름으로 조회해 주세요.
        
        출력 예시:
        
        ```sql
        The Thai Chicken Pizza      | S          |       12.75 |        1 |              12.75
        The Big Meat Pizza          | S          |          12 |        1 |                 12
        The Classic Deluxe Pizza    | S          |          12 |        1 |                 12
        The Italian Capocollo Pizza | M          |          16 |        1 |                 16
        The Spicy Italian Pizza     | L          |       20.75 |        3 |              62.25
        The Four Cheese Pizza       | L          |       17.95 |        1 | 17.950000762939453
        ```
*/

SELECT 
    orders.id,
    pizza_types.name,
    pizzas.size,
    pizzas.price,
    order_details.quantity,
    (pizzas.price * order_details.quantity) AS total_amount
FROM orders
JOIN order_details ON orders.id = order_details.order_id
JOIN pizzas ON pizzas.id = order_details.pizza_id
JOIN pizza_types ON pizzas.type_id = pizza_types.id
WHERE orders.id = 78
GROUP BY orders.id, pizza_types.name, pizzas.size, pizzas.price, order_details.quantity;

-- 오더 마지막 2자리가 78인 경우 아래 조건 삽입
-- WHERE orders.id % 100 = 78




/*    
    4. `order_details`와 `pizzas` 테이블을 JOIN해서 피자 크기별(S, M, L) 총 수익을 계산하고, 크기별 수익을 출력하세요.
        
        출력 예시:
        
        ```sql
        L    |  375318.7010040283
        M    |          249382.25
        S    | 178076.49981307983
        XL   |              14076
        XXL  | 1006.6000213623047
        ```
*/

SELECT 
    pizzas.size,
    SUM(pizzas.price * order_details.quantity) AS total_amount
FROM pizzas
JOIN order_details ON pizzas.id = order_details.pizza_id
GROUP BY pizzas.size
ORDER BY pizzas.size ASC;




/*    
    5. `order_details`, `pizzas`, `pizza_types` 테이블을 JOIN해서 각 피자 종류의 총 수익을 계산하고, 수익이 높은 순서대로 출력하세요.
        
        출력 예시:
        
        ```sql
        The Thai Chicken Pizza                     |           43434.25
        The Barbecue Chicken Pizza                 |              42768
        The California Chicken Pizza               |            41409.5
        The Classic Deluxe Pizza                   |            38180.5
        The Spicy Italian Pizza                    |           34831.25
        The Southwest Chicken Pizza                |           34705.75
        The Italian Supreme Pizza                  |           33476.75
        ```
*/

SELECT 
    pizza_types.name,
    SUM(pizzas.price * order_details.quantity) AS total_amount
FROM orders
JOIN order_details ON orders.id = order_details.order_id
JOIN pizzas ON pizzas.id = order_details.pizza_id
JOIN pizza_types ON pizzas.type_id = pizza_types.id
GROUP BY pizza_types.name
ORDER BY SUM(pizzas.price * order_details.quantity) DESC;
