#!/bin/bash

# 1. 경로 설정
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="../../../"
# 확장자를 .cjs로 지정
CONFIG_FILE="$SCRIPT_DIR/ecosystem.config.cjs" 

echo "📦 패키지 설치 중..."
npm install --prefix $SCRIPT_DIR/$ROOT_DIR

echo "🗄️ DB 마이그레이션 중..."
npx prisma migrate deploy --schema ${SCRIPT_DIR}/${ROOT_DIR}prisma/schema.prisma

echo "🚀 서버 실행 중..."
# PM2로 실행 (기존에 켜져 있으면 reload, 없으면 start)
pm2 reload $CONFIG_FILE || pm2 start $CONFIG_FILE

echo "✅ 모든 작업이 완료되었습니다!"