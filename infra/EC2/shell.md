### EC2 배포 명령어 정리

1. 초기 실행 명령어 : start.sh

2. 배포 한 파일에 문제가 생긴 경우
    1) pm2 상태 확인 
        - pm2 list (현재 실행 중인 프로세스 확인)
        - pm2 logs --lines 20 (에러 로그 확인)
        - pm2 delete all (모든 프로세스 강제 종료)
    2) git repo 최신 파일 적용, 패키지 추가 및 빌드 , 최종 재실행 : reload.sh
    3) pm2 강제 종료 후 재실행 명령어 : pm2 start dist/src/server.js --name "panda-market"
