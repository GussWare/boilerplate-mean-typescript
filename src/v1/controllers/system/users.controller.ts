import { Request, Response } from 'express';
import HttpStatus from 'http-status';
import ApiError from '../../../includes/library/api.error.library';
import { IPaginationOptions, IUser, IUserFilter, IController } from '../../../types';
import UserService from '../../services/system/users/user.service';
import _ from 'lodash';

class UserController implements IController {
  async findPagination(req: Request, res: Response): Promise<void> {
    const { search = '', sort_by = 'created_at:asc', page_size = '10', page = '1' } = req.query;
    const filter: IUserFilter = _.pick(req.query, ['first_name', 'last_name', 'username', 'email']) as IUserFilter;
    const options: IPaginationOptions = {
      search: search as string,
      sort_by: sort_by as string,
      page_size: Number(page_size),
      page: Number(page),
    };

    const data = await UserService.findPaginate(filter, options);

    res.status(HttpStatus.OK).json(data);
  }

  async findAll(_req: Request, res: Response): Promise<void> {
    const data = await UserService.findAll();

    res.status(HttpStatus.OK).json(data);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const resource = await UserService.findById(id);

    if (!resource) {
      throw new ApiError(HttpStatus.NOT_FOUND, global.polyglot.t('USERS_ERROR_USER_NOT_FOUND'));
    }

    res.status(HttpStatus.OK).json(resource);
  }

  async create(req: Request, res: Response): Promise<void> {
    const data: IUser = req.body;
    const resource = await UserService.create(data);

    res.status(HttpStatus.OK).json(resource);
  }

  async update(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const data = req.body;
    const resource = await UserService.update(id, data);

    res.status(HttpStatus.OK).json({ module: resource });
  }

  async enabled(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    await UserService.enabled(id);

    res.status(HttpStatus.NO_CONTENT).send();
  }

  async disabled(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    await UserService.disabled(id);

    res.status(HttpStatus.NO_CONTENT).send();
  }

  async delete(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    await UserService.delete(id);

    res.status(HttpStatus.NO_CONTENT).send();
  }

  async bulkCreate(req: Request, res: Response): Promise<void> {
    const data: IUser[] = req.body;

    await UserService.bulkCreate(data);

    res.status(HttpStatus.NO_CONTENT).send();
  }

  async bulkDelete(req: Request, res: Response): Promise<void> {
    const ids: string[] = req.body.ids;

    await UserService.bulkDelete(ids);

    res.status(HttpStatus.NO_CONTENT).send();
  }
}

export default new UserController();