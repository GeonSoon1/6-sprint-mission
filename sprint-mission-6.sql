-- Active: 1765426447159@@127.0.0.1@5432@pizza_place
-- # 초급 문제

-- 1. `orders` 테이블에서 모든 주문을 조회하세요.
select * 
from orders;


-- 2. `orders`테이블에서 `id` 가 `423`인 주문을 조회하세요.
select *
from orders
where id = 423;


-- 3. `orders` 테이블에서 총 주문 건수를 `total_orders`라는 이름으로 구하세요.
select 
  count(*) as total_orders
from orders;


-- 4. `orders` 테이블에서 최신 순으로 주문을 조회하세요. (`date`, `time` 컬럼이 분리되어 있다는 점에 주의)
select *
from orders
order by date desc, time desc;


-- 5. `orders` 테이블에서 오프셋 기반 페이지네이션된 목록을 조회합니다. 페이지 크기가 10이고 최신순일 때, 첫 번째 페이지를 조회하세요.
select *
from orders
order by date desc, time desc
limit 10
offset 0;


-- 6. `orders` 테이블에서 오프셋 기반 페이지네이션된 목록을 조회합니다. 페이지 크기가 10이고 최신순일 때 5번째 페이지를 조회하세요.
select *
from orders
order by date desc, time desc
limit 10
offset (5-1)*10;


-- 7. `orders` 테이블에서 커서 페이지네이션된 목록을 조회합니다. 페이지 크기가 10이고 최신순일때, `id` 값을 기준으로 커서를 사용합시다. 커서의 값이 `42`일 때 다음 페이지를 조회하세요.
select *
from orders
where 
  (date, time) < (select date, time from orders where id = 42)
order by date desc, time desc
limit 10;


-- 8. `orders` 테이블에서 2025년 3월에 주문된 내역만 조회하세요.
select *
from orders
where 
  date between '2025-03-01' and '2025-03-31'
order by date desc, time desc;


-- 9. `orders` 테이블에서 2025년 3월 12일 오전에 주문된 내역만 조회하세요.
select *
from orders
where
  date = '2025-03-12'
  and time < '12:00:00'
order by date desc, time desc;


-- 10. `pizza_types` 테이블에서 이름에 'Cheese' 혹은 'Chicken'이 포함된 피자 종류를 조회하세요. (대소문자를 구분합니다)
select *
from pizza_types
where 
  name like '%Cheese%'
  or name like '%Chicken%';




-- # 중급 문제

-- 1. `order_details` 테이블에서 각 피자(`pizza_id`)별로 주문된 건 수(`order_id`)를 보여주세요.
select 
  pizza_id
  , count(distinct order_id) as "주문건수"
from order_details 
group by pizza_id
order by 2 desc;


-- 2. `order_details` 테이블에서 각 피자(`pizza_id`)별로 총 주문 수량을 구하세요.
select 
  pizza_id
  , sum(quantity) as "주문수량"
from order_details 
group by pizza_id
order by 2 desc;


-- 3. `pizzas` 테이블에서 `price`의 크기가 20보다 큰 피자의 종류만 `order_details` 테이블에서 조회하세요. (힌트: 서브쿼리)
select *
from order_details
where pizza_id in (
  select id 
  from pizzas 
  where price > 20);


-- 4. `orders` 테이블에서 각 날짜별 총 주문 건수를 `order_count` 라는 이름으로 계산하고, 하루 총 주문 건수가 80건 이상인 날짜만 조회한 뒤, 주문 건수가 많은 순서대로 정렬하세요.
select 
  "date" 
  , count(date) as order_count 
from orders 
group by "date"
having count(date) >= 80
order by order_count desc;


-- 5. `order_details` 테이블에서 피자별(`pizza_id`) 총 주문 수량이 10개 이상인 피자만 조회하고, 총 주문 수량 기준으로 내림차순 정렬하세요.
select
  pizza_id
  , sum(quantity) as "주문수량"
from order_details
group by pizza_id
having sum(quantity) >= 10
order by 2 desc;


-- 6. `order_details` 테이블에서 피자별 총 수익을 `total_revenue` 라는 이름으로 구하세요. (수익 = `quantity * price`)
select 
  z.id 
  , sum(o.quantity*z.price) as total_revenue 
from order_details o 
  join pizzas z on o.pizza_id = z.id 
group by 1
order by 2 desc ;


-- 7. 날짜별로 피자 주문 건수(`order_count`)와 총 주문 수량(`total_quantity`)을 구하세요.
select 
  o.date
  , count(distinct d.order_id) as"주문건수"
  , sum(d.quantity) as"주문수량"
from orders o 
  join order_details d on  o.id = d.order_id
group by o.date
order by 1 desc;




-- # 고급 문제

/*
    1. 피자별(`pizzas.id` 기준) 판매 수량 순위에서 피자별 판매 수량 상위에 드는 베스트 피자를 10개를 조회해 주세요. `pizzas`의 모든 컬럼을 조회하면서 각 피자에 해당하는 판매량을 `total_quantity`라는 이름으로 함께 조회합니다.
*/
select 
  z.id
  , z.type_id
  , z.size
  , z.price
  , sum(o.quantity) as "주문수량"
from order_details o
  join pizzas z on o.pizza_id = z.id
group by z.id
order by 5 desc
limit 10;


/*
    2. `orders` 테이블에서 2025년 3월의 일별 주문 수량을 `total_orders`라는 이름으로, 일별 총 주문 금액을 `total_amount`라는 이름으로 포함해서 조회하세요.
*/
select 
  "date"
  , count(distinct d.order_id) as total_orders
  , sum(d.quantity*z.price) as total_amount 
from orders o
  join order_details d on o.id = d.order_id
  join pizzas z on d.pizza_id = z.id
where 
  "date" between '2025-03-01' and '2025-03-31' 
group by "date"
order by 1 asc;


/*
    3. `order`의 `id`가 78에 해당하는 주문 내역들을 조회합니다. 주문 내역에서 각각 주문한 피자의 이름을 `pizza_name`, 피자의 크기를 `pizza_size`, 피자 가격을 `pizza_price`, 수량을 `quantity`, 각 주문 내역의 총 금액을 `total_amount` 라는 이름으로 조회해 주세요.
*/
select 
  y.name as pizza_name
  , z.size as pizza_size
  , z.price as pizza_price
  , d.quantity as quantity
  , (d.quantity*z.price) as total_amount
from orders o
  join order_details d on o.id = d.order_id
  join pizzas z on d.pizza_id = z.id
  join pizza_types y on z.type_id = y.id
where d.order_id = 78
order by 2 asc;


/*    
    4. `order_details`와 `pizzas` 테이블을 JOIN해서 피자 크기별(S, M, L) 총 수익을 계산하고, 크기별 수익을 출력하세요.
*/
select 
  z.size
  , sum(d.quantity*z.price) as total_amount
from order_details d 
  left join pizzas z on d.pizza_id = z.id 
group by z.size
order by 1 asc;


/*    
    5. `order_details`, `pizzas`, `pizza_types` 테이블을 JOIN해서 각 피자 종류의 총 수익을 계산하고, 수익이 높은 순서대로 출력하세요.
*/
select 
  y.name as pizza_name
  , sum(d.quantity*z.price) as total_amount
from order_details d
  join pizzas z on d.pizza_id = z.id
  join pizza_types y on z.type_id = y.id
group by y.name
order by 2 desc;

