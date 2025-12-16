import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../repositories/userRepository';

/**
 * 생성된 모든 유효성 검사 재확인(validate)
 */
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next(); // 오류가 없으면 다음 미들웨어로
  }
  // 오류가 있으면 배열 형태로 응답
  return res.status(400).json({ errors: errors.array() });
};

/**
 * 사용자 유효성 검사(UserValidators)
 */
export const UserValidators = (userRepository: UserRepository) => {
  const registerValidator = [
    // email 검사
    body('email')
      .notEmpty()
      .withMessage('이메일은 필수 항목입니다.')
      .isEmail()
      .withMessage('이메일 주소를 입력해주세요.')
      .custom(async (email) => {
        const existingUser = await userRepository.findUserByEmailOrNickname({
          email,
        });
        if (existingUser) {
          return Promise.reject('이미 사용 중인 이메일 입니다.');
        }
      }),

    // nickname 검사
    body('nickname')
      .notEmpty()
      .withMessage('닉네임은 필수 항목입니다.')
      .isLength({ min: 2 })
      .withMessage('2자 이상 입력해주세요.')
      .custom(async (nickname) => {
        const existingUser = await userRepository.findUserByEmailOrNickname({
          nickname,
        });
        if (existingUser) {
          return Promise.reject('이미 사용 중인 닉네임입니다.');
        }
      }),

    // password 검사
    body('password')
      .notEmpty()
      .withMessage('비밀번호를 입력해주세요')
      .isLength({ min: 4 })
      .withMessage('비밀번호를 4자 이상 입력해주세요.'),

    // address검사
    body('address').optional().isString().withMessage('주소를 입력해주세요.'),
  ];

  const deleteValidator = [
    // ID 검사
    param('id').notEmpty().isUUID().withMessage('사용자를 찾을 수 없습니다.'),

    // password 검사
    body('password').notEmpty().withMessage('비밀번호를 입력해주세요'),
  ];

  return { registerValidator, deleteValidator };
};

/**
 * 인증 유효성 검사(AuthValidators)
 */
export const AuthValidators = () => {
  const signUpValidator = [
    body('email')
      .notEmpty()
      .withMessage('이메일은 필수 항목입니다.')
      .isEmail()
      .withMessage('이메일 형식이 올바르지 않습니다.'),

    body('password').notEmpty().withMessage('비밀번호를 입력해주세요'),
  ];

  const loginValidator = [
    body('email')
      .notEmpty()
      .withMessage('이메일은 필수 항목입니다.')
      .isEmail()
      .withMessage('이메일 형식이 올바르지 않습니다.'),

    body('password').notEmpty().withMessage('비밀번호를 입력해주세요'),
  ];

  return { loginValidator, signUpValidator };
};

/**
 * 게시글 검증(ArticleValidators)
 */
export const ArticleValidators = () => {
  const validateArticleId = [
    param('articleId')
      .notEmpty()
      .withMessage('게시글 ID는 필수 항목입니다.')
      .isUUID()
      .withMessage('유효하지 않은 게시글 ID 입니다.'),
  ];

  const validateId = [
    param('id')
      .notEmpty()
      .withMessage('게시글 ID는 필수 항목입니다.')
      .isUUID()
      .withMessage('유효하지 않은 게시글 ID 입니다.'),
  ];

  const createValidator = [
    body('title').notEmpty().withMessage('제목을 입력해주세요.'),
    body('content').notEmpty().withMessage('내용을 입력해주세요.'),
  ];

  const updateValidator = [
    body('title').optional().notEmpty().withMessage('제목을 입력해주세요.'),
    body('content').optional().notEmpty().withMessage('내용을 입력해주세요.'),
  ];

  const createCommentValidator = [
    param('articleId').notEmpty().withMessage('유효하지 않은 게시글 ID입니다.'),
    body('content').notEmpty().withMessage('댓글 내용을 입력해주세요.'),
  ];

  const updateCommentValidator = [
    param('commentId').notEmpty().withMessage('유효하지 않은 댓글 ID입니다.'),
    body('content')
      .optional()
      .notEmpty()
      .withMessage('댓글 내용을 입력해주세요.'),
  ];

  return {
    validateArticleId,
    validateId,
    createValidator,
    updateValidator,
    createCommentValidator,
    updateCommentValidator,
  };
};

/**
 * 프로덕트 검증(ProductValidators)
 */
export const ProductValidators = () => {
  const validateId = [
    param('id').notEmpty().isUUID().withMessage('유효하지 않은 ID 입니다.'),
  ];

  const createValidator = [
    body('name').trim().notEmpty().withMessage('상품 이름은 필수 항목입니다.'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('가격은 0 이상의 숫자여야 합니다.'),
    body('description').notEmpty().withMessage('상품 설명은 필수 항목입니다.'),
    body('category').notEmpty().withMessage('카테고리는 필수 항목입니다.'),
  ];

  const updateValidator = [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('상품 이름은 필수 항목입니다.'),
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('가격은 0 이상의 숫자여야 합니다.'),
    body('description')
      .optional()
      .notEmpty()
      .withMessage('상품 설명은 필수 항목입니다.'),
    body('category')
      .optional()
      .notEmpty()
      .withMessage('카테고리는 필수 항목입니다.'),
  ];

  const createCommentValidator = [
    param('productId').notEmpty().withMessage('유효하지 않은 상품 ID입니다.'),
    body('content').notEmpty().withMessage('댓글 내용을 입력해주세요.'),
  ];

  const updateCommentValidator = [
    param('commentId').notEmpty().withMessage('유효하지 않은 댓글 ID입니다.'),
    body('content')
      .optional()
      .notEmpty()
      .withMessage('댓글 내용을 입력해주세요.'),
  ];

  return {
    validateId,
    createValidator,
    updateValidator,
    createCommentValidator,
    updateCommentValidator,
  };
};
