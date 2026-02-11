# 베이스 이미지
ARG NODE_VERSION=24.13.0
FROM node:${NODE_VERSION}

# 환경 변수 선언: express 서버를 실행할 포트
ENV SERVER_PORT=3000

# 이미지 빌드 간 현재 디렉토리 설정: 프로젝트 루트 디렉토리
WORKDIR /app

# 4. 패키지 설치
COPY package*.json ./
RUN npm ci

# 5. 소스 코드 복사 
COPY . .

# 6. Prisma 및 빌드 
RUN npx prisma generate
RUN npm run build

# 컨테이너가 켜질 때 DB 테이블부터 만들고 서버 실행
ENTRYPOINT ["sh", "-c", "npx prisma migrate deploy && npm run start"]