import * as s from 'superstruct';
import { Request, Response, NextFunction } from 'express';
export declare const getNotificationQuerySchema: s.Struct<{
    limit?: number | undefined;
    cursor?: string | undefined;
}, {
    cursor: s.Struct<string | undefined, null>;
    limit: s.Struct<number | undefined, null>;
}>;
export declare function validateGetNotificationQuery(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=validateNotification.d.ts.map