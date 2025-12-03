import { Request, Response, NextFunction } from 'express';
type AsyncHandler = (req: Request, res: Response) => Promise<void>;
export declare function withAsync(handler: AsyncHandler): (req: Request, res: Response, next: NextFunction) => Promise<void>;
export {};
//# sourceMappingURL=withAsync.d.ts.map