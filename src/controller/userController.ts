import { userService } from '../services/userService';
import { ExpressHandler } from '../libs/constants';

export default class UserServiceController {
    register: ExpressHandler = async (req, res) => {
        const user = await userService.createUser(req.body);
        return res.status(201).json(user);
    };

    login: ExpressHandler = async (req, res) => {
        const { email, password } = req.body;
        const user = await userService.getUser(email, password);
        const accessToken = userService.createToken(user);
        const refreshToken = userService.createToken(user, 'refresh');
        await userService.updateUser(user.id, { refreshToken });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true
        });
        return res.status(200).json({ accessToken });
    };
    refresh: ExpressHandler = async (req, res) => {
        const { refreshToken } = req.cookies;
        const { userId } = req.auth!;
        const { accessToken, newRefreshToken } = await userService.refreshToken(userId, refreshToken); // 변경
        await userService.updateUser(userId, { refreshToken: newRefreshToken }); // 추가
        res.cookie('refreshToken', newRefreshToken, { // 추가
            path: '/token/refresh',
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });
        return res.json({ accessToken });
    };
    GetMe: ExpressHandler = async (req, res) => {
        const userId = req.user!.userId;
        const user = await userService.getUserById(userId);
        return res.status(200).json(user);
    };
    updateMe: ExpressHandler = async (req, res) => {
        const userId = req.user!.userId;
        const updatedUser = await userService.updateProfile(userId, req.body);
        return res.status(200).json(updatedUser);
    };

    updateMyPassword: ExpressHandler = async (req, res) => {
        const userId = req.user!.userId;
        const updatedUser = await userService.updatePassword(userId, req.body);
        return res.status(200).json(updatedUser);
    };

    getMyProducts: ExpressHandler = async (req, res) => {
        const userId = req.user!.userId;
        const products = await userService.getProductsByUserId(userId);
        return res.status(200).json(products);
    };

    getMyLikedProducts: ExpressHandler = async (req, res) => {
        const userId = req.user!.userId;
        const products = await userService.getLikedProductsByUserId(userId);
        return res.status(200).json(products);
    };
}
