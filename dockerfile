# Node.js 공식 이미지를 기반으로 생성 (버전은 현재 사용하는 버전에 맞게 수정)
FROM node:22

# 컨테이너 내에서 작업할 디렉토리 설정
WORKDIR /app

# 패키지 관련 파일 먼저 복사 (캐시를 활용하여 빌드 속도 향상)
COPY package.json package-lock.json ./

# 의존성 패키지 설치
RUN npm ci

# 소스 코드 전체 복사
COPY . .


RUN npx prisma generate
RUN npm run build

# 컨테이너에서 접근 가능하도록 포트 노출
EXPOSE 3000

# 서버 실행 명령어 (package.json의 스크립트 기준)
CMD ["npm","run", "start"]