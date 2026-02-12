## 요구사항

### [ 목표 ]

- Github Actions로 테스트, 배포 자동화
- Docker 이미지 만들기


### [ 작업 내용 ]

### 1. 기본 요구사항

1) Github Actions 활용
  - [x] 브랜치에 pull request가 발생하면 테스트를 실행하는 액션을 구현
  - [x] main 브랜치에 push가 발생하면 AWS 배포를 진행하는 액션을 구현 : 현재 개발 환경을 고려하여 main 브랜치 뿐만 아니라 개별 브랜치인 "김지선" 브랜치에도 동일하게 적용
  - [x] 개인 Github 리포지터리에서 Actions 동작을 확인 : ![sprint-mission-11_git-action-history.png](/.github/sprint-mission-11_git-action-history.png)

2) Docker 이미지 만들기
  - [ ] Dockerfile 작성 
  - [ ] Docker의 Volume을 활용하여 파일 업로드 처리
  - [ ] 데이터베이스는 Postgres 이미지를 사용해 연결
  - [ ] 실행된 Express 서버 컨테이너는 호스트 머신에서 3000번 포트로 접근 가능하도록 구현

<br>

## 멘토에게

- 미션 8, 9, 10에 대한 멘토님 코멘트를 적용하며, 전체 코드를 다시 확인하여 리팩토링 진행하였습니다 😁