# 스프린트 미션 10

1. **판다마켓 서비스 AWS 배포**
2. **AWS S3 적용 (이미지 업로드 스토리지)**
3. **AWS RDS 적용 (PostgreSQL 데이터베이스)**
4. **AWS EC2 Express 서버 배포**
5. **(심화) 프로세스 매니저(PM2) 및 리버스 프록시(Nginx) 적용**

---

- **Architecture**: EC2 (App/Nginx) -> RDS (Private), S3 (Public Read)
- **Deployment**: PM2를 이용한 무중단 서비스 관리, Nginx를 이용한 80번 포트 포워딩
- **Security**: RDS는 Private Subnet(외부 접근 차단), EC2 Security Group을 통해서만 접근 허용

---

```
[디렉토리 구조]

10-sprint-mission

├─ infra/           <-- [New] 배포 관련 설정 및 스크린샷
│ ├─ ec2/
│ │ ├─ ecosystem.config.js
│ │ ├─ nginx.conf
│ │ ├─ start.sh
│ │ ├─ secure-group-inbound.png
│ │ └─ secure-group-outbound.png
│ ├─ rds/
│ │ ├─ secure-group-inbound.png
│ │ └─ secure-group-outbound.png
│ └─ s3/
│   └─ policy.png
├─ prisma/
│ ├─ migrations/
│ └─ schema.prisma
├─ src/
│ ├─ liibs/
│ ├─ middlewares/
│ ├─ modules/
│ │ ├─ ...
│ │ └─ images/      <-- [Modified] S3 업로드 로직 적용
│ ├─ app.ts
│ ├─ server.ts
│ └─ upload.ts      <-- [Modified] multer-s3 적용
├─ .env
├─ package.json
└─ README.md
```

### 배포 정보

- **API Base URL**: `http://ec2-54-180-104-148.ap-northeast-2.compute.amazonaws.com/`
- **Region**: `ap-northeast-2` (Seoul)

### 주요 구현 내용

1. **AWS S3**
   - `multer-s3`를 사용하여 프로덕션 환경에서 이미지를 S3 버킷에 직접 업로드
   - IAM Role 및 Bucket Policy를 사용하여 EC2에서 안전하게 접근

2. **AWS RDS**
   - EC2 인스턴스의 보안 그룹에서만 접근 가능한 Private RDS 구축
   - `prisma migrate`를 EC2 내부에서 실행하여 스키마 동기화

3. **AWS EC2 & Nginx**
   - PM2를 사용하여 Node.js 프로세스 관리 (`ecosystem.config.js`)
   - Nginx를 리버스 프록시로 설정하여 80번(HTTP) 요청을 3000번(Node.js)으로 연결

---

#### 작성자 정보

```
이름 : 오윤

이메일 : wingruni@gmail.com

제출일 : 2026-02-03
```
