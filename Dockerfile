# 1. 베이스 이미지 선택 (버전 일치 중요!)
FROM node:18

# 2. 작업 디렉토리 설정
WORKDIR /usr/src/app

# 3. 패키지 파일 복사 (캐싱 효율을 위해 이것 먼저!)
COPY package*.json ./

# 4. 의존성 설치
RUN npm ci

# 5. 소스 코드 복사
COPY . .

# 6. Prisma Client 생성
RUN npx prisma generate

# 7. 빌드 (TypeScript -> JavaScript)
RUN npm run build

# 8. 포트 노출 (문서화 용도)
EXPOSE 3000

# 9. 실행 명령어
CMD ["npm", "start"]
