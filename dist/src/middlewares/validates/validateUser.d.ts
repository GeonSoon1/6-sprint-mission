import * as s from 'superstruct';
import { Request, Response, NextFunction } from 'express';
declare const createUserSchema: s.Struct<{
    email: string;
    nickname: string;
    password: string;
}, {
    email: s.Struct<string, null>;
    nickname: s.Struct<string, null>;
    password: s.Struct<string, null>;
}>;
declare function validateCreateUser(req: Request, res: Response, next: NextFunction): Promise<void>;
declare const loginUserSchema: s.Struct<{
    email: string;
    password: string;
}, {
    email: s.Struct<string, null>;
    password: s.Struct<string, null>;
}>;
declare function validateLoginUser(req: Request, res: Response, next: NextFunction): Promise<void>;
declare const updateUserProfileSchema: s.Struct<{
    password: string;
    nickname?: string | undefined;
    image?: string | undefined;
    newPassword?: string | undefined;
}, {
    nickname: s.Struct<string | undefined, null>;
    image: s.Struct<string | undefined, null>;
    password: s.Struct<string, null>;
    newPassword: s.Struct<string | undefined, null>;
}>;
declare function validateUpdateUser(req: Request, res: Response, next: NextFunction): Promise<void>;
export { validateCreateUser, validateLoginUser, validateUpdateUser, createUserSchema, loginUserSchema, updateUserProfileSchema, };
//# sourceMappingURL=validateUser.d.ts.map