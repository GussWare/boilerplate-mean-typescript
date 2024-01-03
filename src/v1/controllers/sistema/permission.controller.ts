import { Request, Response } from 'express';
import HttpStatus from 'http-status';
import ApiError from '../../../includes/library/api.error.library';
import { IPaginationOptions, IPermission, IPermissionFilter, IController } from '../../../types';
import PermissionService from '../../services/system/permissions/permission.service';
import _ from 'lodash';

class PermissionController implements IController {
  async findPagination(req: Request, res: Response): Promise<void> {
    const { search = '', sort_by = 'createdAt:asc', page_size = '10', page = '1' } = req.query;
    const filter: IPermissionFilter = _.pick(req.query, ['name', 'codename']) as IPermissionFilter;
    const options: IPaginationOptions = {
      search: search as string,
      sort_by: sort_by as string,
      page_size: Number(page_size),
      page: Number(page),
    };

    const data = await PermissionService.findPaginate(filter, options);

    res.status(HttpStatus.OK).json(data);
  }

  async findAll(_req: Request, res: Response): Promise<void> {
    const data = await PermissionService.findAll();

    res.status(HttpStatus.OK).json(data);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const resource = await PermissionService.findById(id);

    if (!resource) {
      throw new ApiError(HttpStatus.NOT_FOUND, global.polyglot.t('USERS_ERROR_USER_NOT_FOUND'));
    }

    res.status(HttpStatus.OK).json(resource);
  }

  async create(req: Request, res: Response): Promise<void> {
    const data: IPermission = req.body;
    const resource = await PermissionService.create(data);

    res.status(HttpStatus.OK).json(resource);
  }

  async update(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const data = req.body;
    const resource = await PermissionService.update(id, data);

    res.status(HttpStatus.OK).json({ module: resource });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    await PermissionService.delete(id);

    res.status(HttpStatus.NO_CONTENT).send();
  }

  async bulkCreate(req: Request, res: Response): Promise<void> {
    const data: IPermission[] = req.body;

    await PermissionService.bulkCreate(data);

    res.status(HttpStatus.NO_CONTENT).send();
  }

  async bulkDelete(req: Request, res: Response): Promise<void> {
    const ids: string[] = req.body.ids;

    await PermissionService.bulkDelete(ids);

    res.status(HttpStatus.NO_CONTENT).send();
  }
}

export default new PermissionController();