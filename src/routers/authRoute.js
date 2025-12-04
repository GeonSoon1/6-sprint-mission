import express from 'express';
import asyncHandler from '../lib/asyncHandler.js';
import * as a from '../controllers/auth-controllers.js';
import { userCreateValidation } from '../validators/user-validation.js';

const authRoute = express.Router();

// ======= ======= ======= ======= =======
// ======= ==== User 인증 기능  ==== =======
// ======= ======= ======= ======= =======

authRoute.post('/register', userCreateValidation, asyncHandler(a.register));
authRoute.post('/login', asyncHandler(a.login));
authRoute.post('/logout', asyncHandler(a.logout));
authRoute.post('/refresh', asyncHandler(a.refreshToken));

export default authRoute;
