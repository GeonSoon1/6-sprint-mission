import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PUBLIC_PATH } from '../lib/constants';

// 파일 작업 상수 선언
const ALLOWED_MIME_TYPES: string[] = ['image/png', 'image/jpeg', 'image/jpg'];

// 5MB 파일 크기 제한
const FILE_SIZE_LIMIT: number = 5 * 1024 * 1024;

// Multer 저장소 설정
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, PUBLIC_PATH);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    // const fileReName = `${Date.now()}_${file.originalname}`;
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

// 이미지 MIME 필터
function imageFileFilter(
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    req.fileValidationError = '이미지 파일만 업로드할 수 있습니다!';
    return cb(null, false);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  limits: { fileSize: FILE_SIZE_LIMIT },
  fileFilter: imageFileFilter,
});

// 프론트에서 업로드 필드명
export const uploadUserImage = upload.single('image');
