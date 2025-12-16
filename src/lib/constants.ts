import dotenv from 'dotenv';
dotenv.config();

const DATABASE_URL: string | undefined = process.env.DATABASE_URL;
const PORT: string | number = process.env.PORT || 3000;
const PUBLIC_PATH: string = './public';
const STATIC_PATH: string = '/public';

const NODE_ENV: string = process.env.NODE_ENV || 'development';
const JWT_ACCESS_TOKEN_SECRET: string =
  process.env.JWT_ACCESS_TOKEN_SECRET || 'your_jwt_access_token_secret';
const JWT_REFRESH_TOKEN_SECRET: string =
  process.env.JWT_REFRESH_TOKEN_SECRET || 'your_jwt_refresh_token_secret';
const ACCESS_TOKEN_COOKIE_NAME: string = 'access-token';
const REFRESH_TOKEN_COOKIE_NAME: string = 'refresh-token';

export {
  DATABASE_URL,
  PORT,
  PUBLIC_PATH,
  STATIC_PATH,
  NODE_ENV,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
};
