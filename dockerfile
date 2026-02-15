# Node.js 이미지를 사용
FROM node:20-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# @aws-sdk/client-s3 패키지 설치
RUN npm install @aws-sdk/client-s3

# Prisma CLI 설치
RUN npm install -g prisma

# PM2를 글로벌로 설치
RUN npm install -g pm2

# 애플리케이션 코드 복사
COPY . .

# Prisma Client 생성
RUN npx prisma generate  # Prisma 클라이언트 생성


# 파일 업로드 폴더를 Docker Volume으로 설정
VOLUME ["/app/uploads"]

# 3000번 포트 열기
EXPOSE 3000

# PM2를 사용하여 src/server.js 실행
CMD ["pm2-runtime", "src/server.js"]
