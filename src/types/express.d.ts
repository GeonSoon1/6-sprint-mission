// src/types/express.d.ts
import { Express } from 'express-serve-static-core';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        name?: string;
        role?: string;
        // 필요한 다른 사용자 속성들을 여기에 추가하세요
      };
      
      // 파일 업로드를 사용하는 경우 (multer)
      file?: Express.Multer.File;
      files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
    }
  }
}

export {};
