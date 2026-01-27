import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  NODE_ENV
} from './constants'

export function setTokenCookies(res, accessToken, refreshToken) {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge : 20 * 60 * 60 * 1000
  })

  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/auth/refresh'
  })
}

export function clearTokenCookies(res) {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME)
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    path: '/auth/refresh'
  })
}

