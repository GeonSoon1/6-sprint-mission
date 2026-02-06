#!/bin/bash

# 1. 프로젝트 빌드 (TypeScript를 JavaScript로 변환)
npm run build

# 2. PM2를 이용해 ecosystem.config.js 설정대로 서버 실행
pm2 start infra/ec2/ecosystem.config.js