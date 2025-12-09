// TODO) Helath-Controller: 요청 처리
// &) Config Import
import prisma from '../config/prisma.js';

// ?) 서버 연결 확인
export const checkHealth = async (_req, res) => {
  res.status(200).json({
    success: true,
    message: '서버 접속 정상',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
};

// ?) DB 연결 확인
export const checkDatabase = async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      message: 'DB 접속 정상',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'DB 접속 실패',
      error: error.message,
    });
  }
};
