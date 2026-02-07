# 초기 실행 명령어
npm install -g pm2
pm2 start dist/src/server.js --name "panda-market"

# -----------------------------------------------------

# 배포 한 파일에 문제가 생겨서 삭제 후 파일 수정하고 다시 run 

# 1. pm2 상태 확인
pm2 list
pm2 logs --lines 20
pm2 delete all

#2. git 작업 pull & 패키지 추가 및 빌드
git pull origin 김지선-sprint10
npm i
npm run build

# 3. pm2 재실행
pm2 start dist/src/server.js --name "panda-market"


# -----------------------------------------------------

# 배포 내용 업데이트 후 다시 run

# 1. 원격 레포지토리에서 최신 코드 가져오기
git pull origin 김지선-sprint10

# 2. 최신 코드로 빌드
npm run build

# 3. 서버 재시작 (모든 프로세스 강제 종료 후 재실행)
pm2 restart all