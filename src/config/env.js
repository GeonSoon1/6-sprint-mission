// TODO) Env-Loader: 환경, 설정, 공통 미들웨어 정의
// ?) 모든 모듈에서 .env를 확실하게 읽도록 공용 로더 제공
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ?) 상대 경로 -> 절대 경로
dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});
