import { Request, Response, NextFunction } from 'express';
interface AuthenticateOptions {
    optional?: boolean;
}
declare function authenticate(options?: AuthenticateOptions): (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default authenticate;
//# sourceMappingURL=authenticate.d.ts.map