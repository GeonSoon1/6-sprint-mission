export declare class BaseError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number);
}
export declare class NotFoundError extends BaseError {
    constructor(message?: string);
}
export declare class BadRequestError extends BaseError {
    constructor(message?: string);
}
export declare class ForbiddenError extends BaseError {
    constructor(message?: string);
}
export declare class AuthorizeError extends BaseError {
    constructor(message?: string);
}
export declare class IsSamePasswordError extends BaseError {
    constructor(message?: string);
}
//# sourceMappingURL=error.d.ts.map