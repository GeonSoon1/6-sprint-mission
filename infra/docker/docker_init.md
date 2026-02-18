
# 도커 컨테이너 생성 및 실행
docker-compose up -d --build

# 도커 컨테이너 내부 DB 테이블 생성 (Migration)
docker exec -it [앱 이름] npx prisma migrate deploy

# 초기 데이터 채우기 (Seeding)
docker exec -it [앱 이름] npx prisma db seed

# 도커 컨테이너 내부 진입
docker exec -it [앱 이름] bash

# 도커 컨테이너 내 특정 폴더 확인 (진입 x)
docker exec [앱 이름] ls -l /app/public

# 도커 컨테이너 중지
docker-compose down

# 도커 컨테이너 삭제
docker-compose down -v

# 도커 컨테이너 재시작
docker-compose restart
