import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../utils/errors";

export class UploadController {
  uploadImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.file) {
        throw new BadRequestError("이미지 파일을 업로드해주세요.");
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      res.status(200).json({
        success: true,
        data: {
          imageUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
