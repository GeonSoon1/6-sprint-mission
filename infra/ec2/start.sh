#!/bin/bash

# 프로젝트 폴더 이동
cd 6-sprint-mission

# 의존성 설치
npm install

# prisma
npx prisma generate
npx prisma migrate deploy

# 타입스크립트 빌드
npm run build

# pm2로 서버 실행
# pm2 start dist/main.js --name sprint-mission

# pm2 ecosystem.config.js를 만든 경우
pm2 start infra/ec2/ecosystem.config.js

# pm2 재부팅 시 자동 실행
pm2 startup
pm2 save