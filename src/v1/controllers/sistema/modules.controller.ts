import { Request, Response } from 'express'
import httpStatus from 'http-status'
import ApiError from '../../../includes/library/api.error.library';
import { IPaginationOptions, IModule, IModuleFilter, IController } from '../../../types';
import moduleService from '../../services/modules/module.service'
import _ from "lodash"

class ModulesController implements IController {

    async findPaginate(req: Request, res: Response): Promise<void> {
        const filter: IModuleFilter = _.pick(req.query, ["name", "slug", "enabled", "guard"]) as IModuleFilter;
        const options: IPaginationOptions = {
            search: req.query.search,
            sortBy: req.query.sortBy,
            //@ts-ignore
            limit: parseInt(req.query.limit),
            //@ts-ignore
            page: parseInt(req.query.page)
        } as IPaginationOptions

        const data = await moduleService.findPaginate(filter, options);

        res.status(httpStatus.OK).json(data);
    }

    async findAll(_req: Request, res: Response): Promise<void> {
        const data = await moduleService.findAll();

        res.status(httpStatus.OK).json(data);
    }

    async findById(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const resource = await moduleService.findById(id);

        if (!resource) {
            //@ts-ignore
            throw new ApiError(httpStatus.NOT_FOUND, global.polyglot.t("USERS_ERROR_USER_NOT_FOUND"));
        }

        res.status(httpStatus.OK).json({ module: resource });
    }

    async create(req: Request, res: Response): Promise<void> {
        const data: IModule = req.body;
        const resource = await moduleService.create(data);

        res.status(httpStatus.OK).json({ module: resource });
    }

    async update(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const data = req.body;

        const resource = await moduleService.update(id, data);

        res.status(httpStatus.OK).json({ module: resource });
    }

    async delete(req: Request, res: Response): Promise<void> {
        const id = req.params.id;

        await moduleService.delete(id);

        res.status(httpStatus.NO_CONTENT).send();
    }

    async enabled(req: Request, res: Response): Promise<void> {
        const id = req.params.id;

        await moduleService.enabled(id);

        res.status(httpStatus.NO_CONTENT).send();
    }

    async disabled(req: Request, res: Response): Promise<void> {
        const id = req.params.id;

        await moduleService.disabled(id);

        res.status(httpStatus.NO_CONTENT).send();
    }

    async bulk(req: Request, res: Response): Promise<void> {

        const data: IModule[] = req.body;

        await moduleService.bulk(data);

        res.status(httpStatus.NO_CONTENT).send();
    }
}

export default new ModulesController();