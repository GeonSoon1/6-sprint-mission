import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import {
  AWS_ACCESS_KEY_ID,
  AWS_BUCKET_NAME,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
  NODE_ENV,
} from './libs/constants';

const uploadDir = 'uploads';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const s3 = new S3Client({
  // credentials: {
  //   accessKeyId: AWS_ACCESS_KEY_ID as string,
  //   secretAccessKey: AWS_SECRET_ACCESS_KEY as string,
  // },
  region: AWS_REGION as string,
});

const storage =
  NODE_ENV === 'production'
    ? multerS3({
        s3: s3,
        bucket: AWS_BUCKET_NAME as string,
        // acl: 'public-read', // 버킷 설정이 ACL 비활성화됨 (Bucket Owner Enforced)
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
          const ext = path.extname(file.originalname);
          const basename = path.basename(file.originalname, ext);
          cb(null, `${basename}-${Date.now()}${ext}`);
        },
      })
    : multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const basename = path.basename(file.originalname, ext);
          const newFilename = `${basename}-${Date.now()}${ext}`;
          cb(null, newFilename);
        },
      });

// 최신 @type/express 에서는 Request가 generic이 아님 아래와 같게 import 하면 Multer가 요구하는 타입을 그대로 따라가면서 TS가 타입 체크 해줌
const fileFilter: import('multer').Options['fileFilter'] = (req, file, cb) => {
  // 확장자를 정할 수 있음
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/jpg',
  ]; // 허용 확장자

  if (allowedMimeTypes.includes(file.mimetype)) {
    // 파일의 확장자가 허용확장자에 포함된다면
    cb(null, true); // 허용
  } else {
    cb(null, false); // 거부
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 최대 10MB
  fileFilter,
});

export default upload;
