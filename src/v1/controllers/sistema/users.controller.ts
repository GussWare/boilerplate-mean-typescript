import { Request, Response } from 'express'
import HttpStatus from 'http-status'
import ApiError from '../../../includes/library/api.error.library';
import { IController, IPaginationOptions, IUser, IUserFilter } from '../../../types';
import userService from '../../services/users/user.service'
import _ from "lodash"

class UserController implements IController {

  async findPaginate(req: Request, res: Response): Promise<void> {
    const filter: IUserFilter = _.pick(req.query, ["name", "surname", "username", "email", "isEmailVerified"]) as IUserFilter;
    const options: IPaginationOptions = {
      search: req.query.search,
      sortBy: req.query.sortBy,
      //@ts-ignore
      limit:  parseInt(req.query.limit),
      //@ts-ignore
      page: parseInt(req.query.page)
  }  as IPaginationOptions

    const data = await userService.findPaginate(filter, options);

    res.status(HttpStatus.OK).json(data);
  }

  async findAll(_req: Request, res: Response): Promise<void> {
    const data = await userService.findAll();

    res.status(HttpStatus.OK).json(data);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const user = await userService.findById(id);

    if (!user) {
      //@ts-ignore
      throw new ApiError(HttpStatus.NOT_FOUND, global.polyglot.t("USERS_ERROR_USER_NOT_FOUND"));
    }

    res.status(HttpStatus.OK).json({ user });
  }

  async create(req: Request, res: Response): Promise<void> {
    const data: IUser = req.body;
    const user = await userService.create(data);

    res.status(HttpStatus.OK).json({ user });
  }

  async update(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const data = req.body;
    
    const user = await userService.update(id, data);

    res.status(HttpStatus.OK).json({ user });
  }

  async remove(): Promise<boolean> {
    return true
  }
}

export default new UserController()
