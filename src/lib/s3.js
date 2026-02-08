// lib/s3.js
import crypto from "crypto";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const {
  AWS_REGION,
  AWS_S3_BUCKET,
  AWS_S3_PUBLIC_URL,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} = process.env;

export const s3 = new S3Client({
  region: AWS_REGION,
  credentials:
    AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY
      ? { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY }
      : undefined,
});

function buildPublicUrl(key) {
  if (AWS_S3_PUBLIC_URL) {
    return `${AWS_S3_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
  }
  return `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
}

export async function uploadImageToS3({ buffer, originalName, contentType, folder = "uploads" }) {
  if (!AWS_REGION || !AWS_S3_BUCKET) {
    throw new Error("S3 업로드 설정이 누락되었습니다. AWS_REGION, AWS_S3_BUCKET(.env)을 확인해주세요.");
  }

  const ext = path.extname(originalName || "") || "";
  const fileName = `${crypto.randomUUID()}${ext}`;
  const key = `${folder}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3.send(command);

  return { key, url: buildPublicUrl(key) };
}
