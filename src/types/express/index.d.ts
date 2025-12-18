import type { User } from '@prisma/client';
import type { File as MulterFile } from 'multer';
import type {
  ProductCustom,
  ProductCommentCustom,
  ArticleCustom,
  ArticleCommentCustom,
} from './body.types';
import type { QueryList } from './query.types';

// 전역 타입 설정
declare global {
  namespace Express {
    interface Request {
      userId: number;
      user: User;
      file?: MulterFile;
      validated: QueryList;
      product: ProductCustom;
      proComment: ProductCommentCustom;
      proLikeId: number;
      article: ArticleCustom;
      artComment: ArticleCommentCustom;
      artLikeId: number;
    }
  }
}
