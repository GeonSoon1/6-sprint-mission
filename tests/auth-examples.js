/**
 * 사용자 인증 API 사용 예제
 * Node.js 환경에서 실행 가능한 실제 코드 예제
 */

const BASE_URL = 'http://localhost:3000';

// 1. 회원가입 (POST /users/signup)
async function signup() {
  const response = await fetch(`${BASE_URL}/users/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'test@example.com',
      nickname: '테스트유저',
      password: 'password123',
    }),
  });

  const data = await response.json();
  console.log('회원가입 성공:', data);
  return data;
}

// 2. 로그인 (POST /users/login)
async function login(email, password) {
  const response = await fetch(`${BASE_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  const data = await response.json();
  console.log('로그인 성공:', data);
  return data; // { accessToken, refreshToken, user }
}

// 3. 토큰 갱신 (POST /users/refresh)
async function refreshToken(refreshToken) {
  const response = await fetch(`${BASE_URL}/users/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refreshToken: refreshToken,
    }),
  });

  const data = await response.json();
  console.log('토큰 갱신 성공:', data);
  return data; // { accessToken, refreshToken }
}

// 4. 내 정보 조회 (GET /users/me) - 인증 필요
async function getMe(accessToken) {
  const response = await fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  console.log('내 정보:', data);
  return data;
}

// 5. 내 정보 수정 (PATCH /users/me) - 인증 필요
async function updateMe(accessToken, nickname, image) {
  const response = await fetch(`${BASE_URL}/users/me`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nickname: nickname,
      image: image,
    }),
  });

  const data = await response.json();
  console.log('정보 수정 성공:', data);
  return data;
}

// 6. 비밀번호 변경 (PATCH /users/me/password) - 인증 필요
async function changePassword(accessToken, currentPassword, newPassword) {
  const response = await fetch(`${BASE_URL}/users/me/password`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      currentPassword: currentPassword,
      newPassword: newPassword,
    }),
  });

  const data = await response.json();
  console.log('비밀번호 변경 성공:', data);
  return data;
}

// 사용 예제
async function example() {
  try {
    // 1. 회원가입
    await signup();

    // 2. 로그인
    const loginResult = await login('test@example.com', 'password123');
    const { accessToken, refreshToken } = loginResult;

    // 3. 내 정보 조회
    await getMe(accessToken);

    // 4. 내 정보 수정
    await updateMe(accessToken, '새로운닉네임', 'https://example.com/image.jpg');

    // 5. 토큰 갱신
    const newTokens = await refreshToken(refreshToken);

    // 6. 비밀번호 변경
    await changePassword(accessToken, 'password123', 'newpassword456');
  } catch (error) {
    console.error('에러 발생:', error);
  }
}

// Node.js 환경에서 실행하려면:
// import fetch from 'node-fetch'; // Node.js 18+ 또는 node-fetch 패키지 필요
// example();

export { signup, login, refreshToken, getMe, updateMe, changePassword };
