import { Request, Response } from "express";
import httpStatus from "http-status";
import ApiError from "../../../includes/library/api.error.library";
import { IActionFilter, IController, IPaginationOptions } from "../../../types";
import actionService from "../../services/modules/action.service";
import _ from "lodash"

class ActionsController implements IController {


    async findPaginate(req: Request, res: Response): Promise<void> {
        const moduleId = req.params.moduleId;

        if (!moduleId)
            //@ts-ignore
            throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("ACTIONS_ERROR_MODULE_ID_REQUIRED"));


        const filter: IActionFilter = _.pick(req.query, ["name", "slug", "guard", "enabled"]) as IActionFilter;
        const options: IPaginationOptions = {
            search: req.query.search,
            sortBy: req.query.sortBy,
            //@ts-ignore
            limit:  parseInt(req.query.limit),
            //@ts-ignore
            page: parseInt(req.query.page)
        }  as IPaginationOptions

        const data = await actionService.findPaginate(filter, options);

        res.status(httpStatus.OK).json(data);
    }


    async findAll(req: Request, res: Response): Promise<void> {
        const moduleId = req.params.moduleId;
        const data = await actionService.findAll(moduleId);

        res.status(httpStatus.OK).json(data);
    }

    async findById(req: Request, res: Response): Promise<void> {
        const moduleId = req.params.moduleId;
        const id = req.params.id;
        const resource = await actionService.findById(moduleId, id);

        res.status(httpStatus.OK).json({ resource });
    }
}


export default new ActionsController();