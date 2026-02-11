import { ExpressRequest, ExpressResponse, ExpressNextFunction } from './../constants';
declare const errorHandler: (err: any, req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => ExpressResponse;
export default errorHandler;
/**
 * 모든 커스텀 에러의 기본이 되는 클래스
 * HTTP 상태 코드와 메시지를 포함하여 Global Error Handler가 쉽게 처리할 수 있도록 합니다.
 */
export declare class CustomError extends Error {
    statusCode: number;
    data: Record<string, object>;
    constructor(statusCode?: number, message?: string, data?: {});
}
export declare const globalErrorHandler: (err: any, req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map