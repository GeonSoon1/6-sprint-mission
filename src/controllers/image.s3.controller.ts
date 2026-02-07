import { Request, Response } from 'express';
import multer from 'multer';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PUBLIC_PATH, STATIC_PATH } from '@lib/constants';
import BadRequestError from '@lib/errors/BadRequestError';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const FILE_SIZE_LIMIT = 10 * 1024 * 1024;

// [S3 전용 설정]
const s3Params = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
};

const s3 = new S3Client(s3Params);

// 환경에 따라 스토리지 엔진 교체
const storage =
  process.env.NODE_ENV === 'production'
    ? multerS3({ // multerS3 설정
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME!,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req: any, file: any, cb: any) {
          const ext = path.extname(file.originalname);
          const filename = `${uuidv4()}${ext}`;
          cb(null, filename);
        },
      })
    : // Development/Test: 로컬 디스크에 저장 (기존 로직 유지)
      multer.diskStorage({
        destination(req, file, cb) {
          cb(null, PUBLIC_PATH);
        },
        filename(req, file, cb) {
          const ext = path.extname(file.originalname);
          const filename = `${uuidv4()}${ext}`;
          cb(null, filename);
        },
      });

export const upload = multer({
  storage,
  limits: {
    fileSize: FILE_SIZE_LIMIT,
  },
  fileFilter: function (req, file, cb) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      const err = new BadRequestError('Only png, jpeg, and jpg are allowed');
      return cb(err as any);
    }
    cb(null, true);
  },
});

export async function uploadImage(req: Request, res: Response) {
  const host = req.get('host');
  if (!host) {
    throw new BadRequestError('Host is required');
  }
  if (!req.file) {
    throw new BadRequestError('File is required');
  }

  // S3 업로드 시 `req.file.location`에 S3 URL 저장
  const location = (req.file as any).location;

  let url;
  if (location) {
    url = location; // S3 URL
  } else {
    const filePath = path.join(host, STATIC_PATH, req.file.filename);
    url = `http://${filePath}`; // 로컬 URL
  }

  res.send({ url });
}
