import { IAction, IPaginationOptions, IPaginationResponse } from "../../../types";
import ActionModel from "../../models/sistema/actions.model";
import _ from "lodash";

class ActionService {

    async findPaginate(filter: IAction, options: IPaginationOptions): Promise<IPaginationResponse> {
        //@ts-ignore
        const data: IPaginationResponse = await UserModel.paginate(filter, options);
        return data;
    }

    async findAll(moduleId: string): Promise<IAction[]> {
        const data = await ActionModel.find({
            module: moduleId
        });

        return data;
    }

    async findById(moduleId: string, id: string): Promise<IAction | null> {
        const resource = await ActionModel.findOne({
            module: moduleId,
            _id: id,
        });

        return resource;
    }

    async bulkSave(moduleId: string, data: IAction[]): Promise<boolean> {
        const dataBulk = _.map(data, (value) => {
            value.module = moduleId;
            return value;
        });

        const dataCreate = _.filter(dataBulk, (value) => value.id  == null);
        const dataUpdate = _.filter(dataBulk, (value) => value.id  != null);

        const dataCreateChunk = _.chunk(dataCreate, 1000);

        for (const key in dataCreateChunk) {
            await ActionModel.insertMany(dataCreateChunk[key]);
        }

        for (const iterator of dataUpdate) {
            await ActionModel.updateOne(iterator.id, iterator);
        }

        return true;
    }
}


export default new ActionService();