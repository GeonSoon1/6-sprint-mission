### Action push / pull_request 동작 방식

1. push : 브랜치에 코드가 푸시될 때
2. pull_request : 브랜치에 코드가 머지될 때


### 현재 구현 방식에서의 워크플로우

1. 로컬에서 git 저장 : git add . & git commit -m "..." 
2. 원격 레포지토리로 로컬 저장 내용을 Push : action.yml에 설정 해 둔 "on.push"에 의해 Action이 실행
3. 공용 레포(학원 레포)로 PR 생성 : action.yml에 설정 해 둔 "on.pull_request"에 의해 Action이 실행
4. 멘토님의 PR 리뷰 후 승인 시, 공용 레포에 머지 -> deploy.yml에 설정 해 둔 "on.push"에 의해 Action이 실행


