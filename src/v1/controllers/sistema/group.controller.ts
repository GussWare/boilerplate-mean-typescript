import { Request, Response } from 'express'
import HttpStatus from 'http-status'
import ApiError from '../../../includes/library/api.error.library';
import { IPaginationOptions, IGroup, IGroupFilter, IController } from '../../../types';
import GroupService from '../../services/system/groups/group.service';
import _ from "lodash"

class GroupController implements IController {
    
    /**
     * Finds and paginates groups based on the provided filter and pagination options.
     * 
     * @param req - The request object.
     * @param res - The response object.
     * @returns A promise that resolves to void.
     */
    async findPagination(req: Request, res: Response): Promise<void> {
        const { search = "",  sort_by = "createdAt:asc",  page_size = "10", page = "1" } = req.query;
        const filter: IGroupFilter = _.pick(req.query, ["name", "codename"]) as IGroupFilter;
        const options: IPaginationOptions = {
            search: search as string,
            sort_by: sort_by as string,
            page_size: Number(page_size),
            page: Number(page),
        };

        const data = await GroupService.findPaginate(filter, options);

        res.status(HttpStatus.OK).json(data);
    }

    /**
     * Retrieves all groups.
     * 
     * @param _req - The request object.
     * @param res - The response object.
     * @returns A promise that resolves to void.
     */
    async findAll(_req: Request, res: Response): Promise<void> {
        const data = await GroupService.findAll();

        res.status(HttpStatus.OK).json(data);
    }

    /**
     * Finds a group by its ID.
     * 
     * @param req - The request object.
     * @param res - The response object.
     * @returns A Promise that resolves to void.
     */
    async findById(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const resource = await GroupService.findById(id);

        if (!resource) {
            throw new ApiError(HttpStatus.NOT_FOUND, global.polyglot.t("GENERAL_ERROR_NOT_FOUND"));
        }

        res.status(HttpStatus.OK).json(resource);
    }

    /**
     * Creates a new group.
     * 
     * @param req - The request object.
     * @param res - The response object.
     * @returns A promise that resolves to void.
     */
    async create(req: Request, res: Response): Promise<void> {
        const data: IGroup = req.body;
        const resource = await GroupService.create(data);

        res.status(HttpStatus.OK).json(resource);
    }

    /**
     * Updates a group with the specified ID.
     * 
     * @param req - The request object.
     * @param res - The response object.
     * @returns A Promise that resolves to void.
     */
    async update(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const data = req.body;

        const resource = await GroupService.update(id, data);

        res.status(HttpStatus.OK).json(resource);
    }

    /**
     * Deletes a group by its ID.
     * 
     * @param req - The request object.
     * @param res - The response object.
     * @returns A promise that resolves when the group is deleted.
     */
    async delete(req: Request, res: Response): Promise<void> {
        const id = req.params.id;

        await GroupService.delete(id);

        res.status(HttpStatus.NO_CONTENT).send();
    }

    /**
     * Creates multiple groups.
     * 
     * @param req - The request object.
     * @param res - The response object.
     * @returns A promise that resolves when the groups are created.
     */
    async bulkCreate(req: Request, res: Response): Promise<void> {

        const data: IGroup[] = req.body;

        await GroupService.bulkCreate(data);

        res.status(HttpStatus.NO_CONTENT).send();
    }

    /**
     * Deletes multiple groups by their IDs.
     * 
     * @param req - The request object.
     * @param res - The response object.
     * @returns A promise that resolves when the groups are deleted.
     */
    async bulkDelete(req: Request, res: Response): Promise<void> {
        const ids: string[] = req.body.ids;

        await GroupService.bulkDelete(ids);

        res.status(HttpStatus.NO_CONTENT).send();
    }
}

export default new GroupController();