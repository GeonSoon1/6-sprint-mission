// TODO) Health-Routes: 헬스 체크
// &) Config Import
import express from 'express';

// &) Controller Import
import {
  checkHealth,
  checkDatabase,
} from '../controllers/health-controller.js';

const router = express.Router();

// ?) 서버 연결 확인
router.get('/', checkHealth);

// ?) DB 연결 확인
router.get('/db', checkDatabase);

export default router;
