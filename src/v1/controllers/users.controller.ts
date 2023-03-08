import { Request, Response } from 'express'
import HttpStatus from 'http-status'
import _ from "underscore"
import ApiError from '../../includes/library/api.error.library';
import { IPaginationOptions, IUser, IUserFilter } from '../../types';
import UserService from '../services/users/user.service'

class UserController {

  protected UserService: UserService;

  constructor() {
    this.UserService = new UserService();
  }

  async findPaginate(req: Request, res: Response): Promise<void> {
    const filter: IUserFilter = _.pick(req.query, ["name", "surname", "username", "email", "isEmailVerified"]) as IUserFilter;
    const options: IPaginationOptions = _.pick(req.query, ["search", "sortBy", "limit", "page"]) as IPaginationOptions;

    const data = await this.UserService.findPaginate(filter, options);

    res.status(HttpStatus.OK).json(data);
  }

  async findAll(_req: Request, res: Response): Promise<void> {
    const data = await this.UserService.findAll();

    res.status(HttpStatus.OK).json(data);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const user = await this.UserService.findById(id);

    if (!user) {
      //@ts-ignore
      throw new ApiError(HttpStatus.NOT_FOUND, global.polyglot.t("USERS_ERROR_USER_NOT_FOUND"));
    }

    res.status(HttpStatus.OK).json({ user });
  }

  async create(req: Request, res: Response): Promise<void> {
    const data: IUser = req.body;
    const user = await this.UserService.create(data);

    res.status(HttpStatus.OK).json({ user });
  }

  async update(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const data = req.body;
    
    const user = await this.UserService.update(id, data);

    res.status(HttpStatus.OK).json({ user });
  }

  async remove(): Promise<boolean> {
    return true
  }
}

export default new UserController()
