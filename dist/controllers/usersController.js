import { create } from 'superstruct';
import { userService } from '../services/userService.js';
import { UpdateMeBodyStruct, UpdatePasswordBodyStruct, GetMyProductListParamsStruct, GetMyFavoriteListParamsStruct, } from '../structs/usersStructs.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
export async function getMe(req, res) {
    if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
    }
    const user = await userService.getMe(req.user.id);
    res.send(user);
}
export async function updateMe(req, res) {
    if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
    }
    const data = create(req.body, UpdateMeBodyStruct);
    const updatedUser = await userService.updateMe(req.user.id, data);
    res.status(200).send(updatedUser);
}
export async function updateMyPassword(req, res) {
    if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
    }
    const data = create(req.body, UpdatePasswordBodyStruct);
    await userService.updatePassword(req.user.id, data);
    res.status(200).send();
}
export async function getMyProductList(req, res) {
    if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
    }
    const query = create(req.query, GetMyProductListParamsStruct);
    const result = await userService.getMyProductList(req.user.id, query);
    res.send(result);
}
export async function getMyFavoriteList(req, res) {
    if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
    }
    const query = create(req.query, GetMyFavoriteListParamsStruct);
    const result = await userService.getMyFavoriteList(req.user.id, query);
    res.send(result);
}
//# sourceMappingURL=usersController.js.map