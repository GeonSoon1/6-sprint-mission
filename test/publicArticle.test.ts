import request from 'supertest';
import { prismaClient } from '@lib/prismaClient';
import app from '@/app';
import { userSample, articleSample } from '@test/helper/mockdata';

describe('인증이 필요하지 않은 게시글 API 통합 테스트', () => {
  console.log('public article run!!');

  beforeEach( async ()=> {
    // DB 데이터 삭제는 가장 관계 설정이 적은 단위부터 시행
    await prismaClient.notification.deleteMany();
    await prismaClient.like.deleteMany();
    await prismaClient.favorite.deleteMany();
    await prismaClient.comment.deleteMany();

    await prismaClient.article.deleteMany();
    await prismaClient.product.deleteMany();

    await prismaClient.user.deleteMany();
  })

  afterAll(async()=>{
    await prismaClient.$disconnect();
  })
});
