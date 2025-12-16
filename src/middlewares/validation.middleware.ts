import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../utils/errors";

export const validateProductCreate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, description, price, tags } = req.body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw new BadRequestError("상품명은 필수이며 문자열이어야 합니다.");
  }

  if (
    !description ||
    typeof description !== "string" ||
    description.trim().length === 0
  ) {
    throw new BadRequestError("상품 설명은 필수이며 문자열이어야 합니다.");
  }

  if (!price || typeof price !== "number" || price <= 0) {
    throw new BadRequestError("가격은 필수이며 0보다 큰 숫자여야 합니다.");
  }

  if (!tags || !Array.isArray(tags)) {
    throw new BadRequestError("태그는 필수이며 배열이어야 합니다.");
  }

  next();
};

export const validateProductUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, description, price, tags, status } = req.body;

  if (
    name !== undefined &&
    (typeof name !== "string" || name.trim().length === 0)
  ) {
    throw new BadRequestError("상품명은 문자열이어야 합니다.");
  }

  if (
    description !== undefined &&
    (typeof description !== "string" || description.trim().length === 0)
  ) {
    throw new BadRequestError("상품 설명은 문자열이어야 합니다.");
  }

  if (price !== undefined && (typeof price !== "number" || price <= 0)) {
    throw new BadRequestError("가격은 0보다 큰 숫자여야 합니다.");
  }

  if (tags !== undefined && !Array.isArray(tags)) {
    throw new BadRequestError("태그는 배열이어야 합니다.");
  }

  if (
    status !== undefined &&
    !["SALE", "SOLD_OUT", "RESERVED"].includes(status)
  ) {
    throw new BadRequestError(
      "상태는 SALE, SOLD_OUT, RESERVED 중 하나여야 합니다."
    );
  }

  next();
};

export const validateArticleCreate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { title, content } = req.body;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    throw new BadRequestError("제목은 필수이며 문자열이어야 합니다.");
  }

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    throw new BadRequestError("내용은 필수이며 문자열이어야 합니다.");
  }

  next();
};

export const validateArticleUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { title, content } = req.body;

  if (
    title !== undefined &&
    (typeof title !== "string" || title.trim().length === 0)
  ) {
    throw new BadRequestError("제목은 문자열이어야 합니다.");
  }

  if (
    content !== undefined &&
    (typeof content !== "string" || content.trim().length === 0)
  ) {
    throw new BadRequestError("내용은 문자열이어야 합니다.");
  }

  next();
};

export const validateCommentCreate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { content } = req.body;

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    throw new BadRequestError("댓글 내용은 필수이며 문자열이어야 합니다.");
  }

  next();
};

export const validateUserSignup = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, nickname, password } = req.body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    throw new BadRequestError("유효한 이메일 주소를 입력해주세요.");
  }

  if (
    !nickname ||
    typeof nickname !== "string" ||
    nickname.trim().length === 0
  ) {
    throw new BadRequestError("닉네임은 필수입니다.");
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    throw new BadRequestError("비밀번호는 최소 6자 이상이어야 합니다.");
  }

  next();
};

export const validateUserLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;

  if (!email || typeof email !== "string") {
    throw new BadRequestError("이메일을 입력해주세요.");
  }

  if (!password || typeof password !== "string") {
    throw new BadRequestError("비밀번호를 입력해주세요.");
  }

  next();
};
