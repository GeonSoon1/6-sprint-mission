import type { User } from '@prisma/client';
import {
  createArticleSchema,
  getArticleQuerySchema,
  updateArticleSchema,
} from '../src/middlewares/validates/validateArticle';
import { Infer } from 'superstruct';
import {
  createCommentSchema,
  getListCommentSchema,
  updateCommentSchema,
} from '../src/middlewares/validates/validateComment';
import {
  validateArticleId,
  validateId,
  validateProductId,
} from '../src/middlewares/validates/validateId';
import {
  createProductSchema,
  getProductQuerySchema,
  updateProductSchema,
} from '../src/middlewares/validates/validateProduct';
import {
  createUserSchema,
  loginUserSchema,
  updateUserProfileSchema,
} from '../src/middlewares/validates/validateUser';

export interface AuthPayload {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
      auth?: AuthPayload;
    }

    interface Request {
      // Article 유효성 검증
      validatedArticleQuery?: Infer<typeof getArticleQuerySchema>;
      validatedArticleUpdate?: Infer<typeof updateArticleSchema>;
      validatedArticleCreate?: Infer<typeof createArticleSchema>;
    }

    interface Request {
      // Product 유효성 검증
      validatedProductQuery?: Infer<typeof getProductQuerySchema>;
      validatedProductUpdate?: Infer<typeof updateProductSchema>;
      validatedProductCreate?: Infer<typeof createProductSchema>;
    }

    interface Request {
      // Comment 유효성 검증
      validatedCommentCreate?: Infer<typeof createCommentSchema>;
      validatedCommentUpdate?: Infer<typeof updateCommentSchema>;
      validatedCommentGetList?: Infer<typeof getListCommentSchema>;
    }

    interface Request {
      // Id 유효성 검증
      validatedId?: Infer<typeof validateId>;
      validatedProductId?: Infer<typeof validateProductId>;
      validatedArticleId?: Infer<typeof validateArticleId>;
    }

    interface Request {
      // User 유효성 검증
      validatedUserCreate?: Infer<typeof createUserSchema>;
      validatedUserLogin?: Infer<typeof loginUserSchema>;
      validatedUserUpdate?: Infer<typeof updateUserProfileSchema>;
    }

    interface Request {
      // Notification 유효성 검증
      validatedNotificationId?: Infer<typeof validateNotificationId>;
      validatedNotificationQuery?: Infer<typeof getNotificationQuerySchema>;
    }
  }
}
