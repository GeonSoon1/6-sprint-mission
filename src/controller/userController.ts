import { Request, Response } from 'express';
import { assert } from 'superstruct';
import { patchUser, patchUserPassword } from '../structs/userStructs';
import userService from '../service/userService';

class UserController {
  async getMe(req: Request, res: Response) {
    const result = await userService.getMe(req.user?.id);
    res.status(200).send(result);
  }

  async updateMe(req: Request, res: Response) {
    assert(req.body, patchUser);

    const result = await userService.updateMe(req.user?.id, req.body);
    res.status(200).send(result);
  }

  async updateMyPassword(req: Request, res: Response) {
    assert(req.body, patchUserPassword);

    const { currentPassword, newPassword } = req.body;

    const result = await userService.updateMyPassword(req.user?.id, currentPassword, newPassword);

    res.status(200).send(result);
  }

  async getMyProduct(req: Request, res: Response) {
    const products = await userService.getMyProducts(req.user?.id);
    res.status(200).send(products);
  }

  async getLikedProducts(req: Request, res: Response) {
    const products = await userService.getLikedProducts(req.user?.id);
    res.send(products);
  }
}

export default new UserController();
