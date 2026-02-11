import { Request, Response, NextFunction } from 'express';
declare function defaultNotFoundHandler(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>>;
interface CustomError extends Error {
    code?: string;
    path?: string[];
}
declare function globalErrorHandler(err: CustomError, req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export { defaultNotFoundHandler, globalErrorHandler };
//# sourceMappingURL=errorHandler.d.ts.map