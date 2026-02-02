import multer from 'multer';
import path from 'path';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';

const isProd = process.env.NODE_ENV === 'production';

/* ---------- S3 설정 ---------- */
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/* ---------- multer storage ---------- */
const storage = isProd
  ? multerS3({
      s3,
      bucket: process.env.AWS_S3_BUCKET_NAME!,
      acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `uploads/${Date.now()}${ext}`);
      },
    })
  : multer.diskStorage({
      destination: 'uploads/',
      filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
      },
    });

export const upload = multer({ storage });
