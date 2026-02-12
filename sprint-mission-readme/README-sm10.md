## 요구사항

### [ 목표 ]

- 판다마켓 서비스를 AWS로 배포하기 
- AWS S3 적용 
- AWS RDS 적용 
- AWS EC2에 Express 서버 배포하기 
- (심화) 프로세스 매니저 적용 
- (심화) 리버스 프록시 적용 


### [ 작업 내용 ]

### 1. 기본 요구사항

- [x] 프로젝트에 프로덕션 배포를 위한 환경 변수 설정 

1) AWS S3 적용 
  - [x] AWS S3 버킷 생성 및 퍼블릭 액세스 허용 
  - [x] 일반 사용자가 S3 업로드된 파일에 접근할 수 있도록 S3 버킷 정책 설정 
  - [x] AWS EC2에서 AWS S3를 사용하기 위한 액세스 키를 AWS IAM에서 발급 
  - [x] 프로덕션 환경에서는 파일 업로드에 AWS S3를 사용하도록 구현 수정 : /src/controllers/image.s3.controller.ts 
2) AWS RDS 적용 
  - [x] AWS RDS 프리티어에 해당하는 인스턴스 생성 
  - [x] RDS 인스턴스에 대한 보안 그룹 설정 
  - [x] 프로덕션 환경에서는 Prisma에 프로젝트 데이터베이스와 연결하도록 수정 
3) AWS EC2에 Express 서버 배포하기 
  - [x] AWS EC2 프리티어에 해당하는 인스턴스 생성 
  - [x] SSH를 사용해 EC2 인스턴스에 접속해 Express 서버 배포

### 2. 심화 요구사항

- [x] EC2 인스턴스에서 pm2 프로세스 매니저를 사용하여 애플리케이션을 실행
- [x] EC2 인스턴스에서 nginx 리버스 프록시를 80번 포트로 설정


## [제출 파일 목록] 

- [x] 접속 가능한 API 엔드포인트 주소 : http://13.125.62.54
- [x] AWS S3 버킷의 정책 설정 : /infra/S3/policy.png 
- [x] AWS RDS 인스턴스의 보안 그룹 설정 
  1. 인바운드 : /infra/RDS/secure-group-inbound.png 
  2. 아웃바운드 : /infra/RDS/secure-group-outbound.png 
- [x] AWS EC2 인스턴스의 보안 그룹 설정 
  1. 인바운드 : /infra/EC2/secure-group-inbound.png 
  2. 아웃바운드 : /infra/EC2/secure-group-outbound.png 
  3. 초기 / 최종 URL 비교 : /infra/EC2/secure-group-url.png
- [x] pm2 실행 명령어 : /infra/ec2/start.sh 
- [ ] pm2 실행 설정 파일 : /infra/ec2/ecosystem.config.js -> 별도의 설정 없이 실행
- [x] nginx 실행 설정 파일 : /infra/ec2/nginx.conf 

<br><br><br><br>

## 멘토에게

- 이번 미션은 전적으로 AI의 도움을 받아 진행하였으며, images.s3.controller.ts 파일은 Ai가 작성하고 검토만 진행하였습니다 (파일 라우터를 초급 프로젝트 때부터 공부하고 있지만, 여전히 전체 로직이 이해가지 않습니다 😭ㅎㅎ)
- 제출 요청 파일 외에도 S3 테스트를 진행한 결과를 함께 제출합니다(자랑용입니다. 작업 도중 문제가 생겨서 좀 헤멧지만 그래도 성공 했다는게 좀 뿌듯해서요😁)
  1. 터미널을 사용하여 이미지 업로드 : /infra/S3/img_test_terminal.png 
  2. 터미널 명령어 : /infra/S3/imgUpload.s3.sh
  3. AWS S3 버킷에 업로드된 이미지 목록 : /infra/S3/img_test_s3.png
- 개인적인 일도 있고해서 미션 8,9에 대한 멘토님 코멘트를 신규 코드에 적용 할 시간이 없네요. 신경 써서 알려주셨는데 죄송합니다😢 
