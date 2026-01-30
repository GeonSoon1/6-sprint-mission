import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const NODE_ENV = process.env.NODE_ENV || 'development';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

let storage;

if (NODE_ENV === 'production') {
  storage = multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME as string,
    key: (req, file, callback) => {
      const ext = path.extname(file.originalname); // 확장자 받아오기
      const randomName = crypto.randomBytes(8).toString('hex');
      callback(null, `${randomName}_${Date.now()}${ext}`); // random 파일명 만들기
    },
  });
} else {
  storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
      const ext = path.extname(file.originalname); // 확장자 받아오기
      const randomName = crypto.randomBytes(8).toString('hex');
      callback(null, `${randomName}_${Date.now()}${ext}`); // random 파일명 만들기
    },
  });
}

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadPath = path.join(__dirname, '..', '..', 'uploads');
