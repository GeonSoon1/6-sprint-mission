#!/bin/bash
# 사용자 인증 API 사용 예제
# curl 명령어로 실제 사용 가능한 예제

BASE_URL="http://localhost:3000"

echo "=== 1. 회원가입 (POST /users/signup) ==="
curl -X POST "${BASE_URL}/users/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "nickname": "테스트유저",
    "password": "password123"
  }' \
  -w "\n"

echo -e "\n=== 2. 로그인 (POST /users/login) ==="
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "$LOGIN_RESPONSE"

# JSON에서 토큰 추출 (jq가 설치되어 있다면)
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"refreshToken":"[^"]*' | cut -d'"' -f4)

echo -e "\n=== 3. 내 정보 조회 (GET /users/me) ==="
curl -X GET "${BASE_URL}/users/me" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -w "\n"

echo -e "\n=== 4. 내 정보 수정 (PATCH /users/me) ==="
curl -X PATCH "${BASE_URL}/users/me" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "수정된닉네임",
    "image": "https://example.com/image.jpg"
  }' \
  -w "\n"

echo -e "\n=== 5. 토큰 갱신 (POST /users/refresh) ==="
curl -X POST "${BASE_URL}/users/refresh" \
  -H "Content-Type: application/json" \
  -d "{
    \"refreshToken\": \"${REFRESH_TOKEN}\"
  }" \
  -w "\n"

echo -e "\n=== 6. 비밀번호 변경 (PATCH /users/me/password) ==="
curl -X PATCH "${BASE_URL}/users/me/password" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword456"
  }' \
  -w "\n"

