# Base Build image

# node 버전 설정
ARG NODE_VERSION=22.19.0
FROM node:${NODE_VERSION}

# 서버 포트 설정
ENV SERVER_PORT=3000

# 디렉토리 설정 
WORKDIR /app

# 복사할 작업 분할(레이어 캐싱)
# 1) package.json, package-lock.json 복사
COPY package*.json ./
RUN npm install

# 2) prisma 복사
COPY prisma ./prisma/
RUN npx prisma generate

# 3) 나머지 파일 복사 및 빌드
COPY . .
RUN npm run build

# 서버 실행 명령어 
CMD ["node", "dist/src/server.js"]