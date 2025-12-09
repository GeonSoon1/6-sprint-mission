# 충돌 해결 가이드

## 충돌이 발생한 파일들

다음 파일들에서 충돌이 발생할 수 있습니다:

- `.gitignore`
- `.prettierrc`
- `package.json`
- `package-lock.json`

## 해결 방법

### 중요 사항 ⚠️

현재 브랜치(`이주은-sprint5`)의 파일들은 **TypeScript 마이그레이션 및 Layered Architecture가 적용된 최신 버전**입니다.
충돌이 발생하면 **반드시 현재 브랜치의 버전을 유지**해야 합니다.

### GitHub에서 충돌 해결 (권장)

1. Pull Request 페이지에서 "Resolve conflicts" 버튼 클릭
2. 충돌이 발생한 각 파일을 확인
3. **현재 브랜치(이주은-sprint5)의 내용을 유지**하도록 선택
4. 충돌 마커 제거:
   ```
   <<<<<<< 이주은-sprint5
   [현재 브랜치의 내용 - 이 부분을 유지]
   =======
   [다른 브랜치의 내용 - 이 부분을 삭제]
   >>>>>>> main (또는 다른 브랜치)
   ```
5. "Mark as resolved" 클릭
6. 모든 충돌 해결 후 "Commit merge" 클릭

### 로컬에서 충돌 해결

로컬에서 충돌을 해결하려면:

```bash
# 1. 충돌이 발생한 브랜치로 체크아웃
git checkout 이주은-sprint5

# 2. 병합 시도 (충돌 발생)
git merge origin/main  # 또는 충돌이 발생하는 브랜치

# 3. 충돌이 발생한 파일들을 현재 브랜치 버전으로 유지
git checkout --ours .gitignore
git checkout --ours .prettierrc
git checkout --ours package.json
git checkout --ours package-lock.json

# 4. 해결된 파일들을 스테이징
git add .gitignore .prettierrc package.json package-lock.json

# 5. 병합 커밋
git commit -m "resolve: 충돌 해결 - TypeScript 마이그레이션 버전 유지"

# 6. 원격 저장소에 푸시
git push origin 이주은-sprint5
```

### 각 파일의 중요성

#### `.gitignore`

- TypeScript 빌드 결과물(`dist/`) 제외
- 환경 변수 파일(`.env`) 제외
- 테스트 파일 제외

#### `.prettierrc`

- 코드 포맷팅 설정
- TypeScript 프로젝트에 맞게 설정됨

#### `package.json`

- TypeScript 및 관련 타입 정의 패키지 포함
- 개발 도구 (tsx, nodemon) 포함
- 빌드 스크립트 포함

#### `package-lock.json`

- 정확한 패키지 버전 정보
- TypeScript 관련 패키지 버전 고정

이 파일들은 TypeScript 마이그레이션에 필수적이므로 **반드시 현재 브랜치의 버전을 유지**해야 합니다.
