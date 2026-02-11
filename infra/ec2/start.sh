# 초기화
pm2 delete "panda-market-api" 2>/dev/null || true

#앱실행
pm2 start dist/main.js --name "panda-market-api"

# 현재상태 저장
pm2 save

#-------
#앱 자동 실행
#pm2 startup 

#pm2 reload 0
#pm2 stop 0
#pm2 restart 0