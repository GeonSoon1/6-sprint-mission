import { PrismaClient, Prisma } from '@prisma/client';
import express, { RequestHandler, Request, Response, NextFunction } from 'express';
export declare const EXPRESS: typeof express;
export declare const PORT: string | number;
export declare const prismaClient: PrismaClient<Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export { Prisma };
export type ExpressHandler = RequestHandler;
export type ExpressRequest = Request;
export type ExpressResponse = Response;
export type ExpressNextFunction = NextFunction;
//# sourceMappingURL=constants.d.ts.map