import dotenv from 'dotenv';
dotenv.config();

export const DATABASE_URL = process.env.DATABASE_URL!; // !를 써서 있다고 단언
export const PORT = process.env.PORT || 4000;
export const PUBLIC_PATH = './public'; // 리터럴 타입
export const STATIC_PATH = '/public'; // 리터럴 타입
