import { ICrudService, IPaginationOptions, IGroup, IGroupFilter, IPaginationResponse } from "../../../../types"
import GroupModel from "../../../db/models/system/group.model"
import ApiError from "../../../../includes/library/api.error.library";
import _ from "lodash"
import HttpStatus from "http-status";

class GroupService implements ICrudService {

  async findPaginate(filter: IGroupFilter, options: IPaginationOptions): Promise<IPaginationResponse> {
    //@ts-ignore
    const data: IPaginationResponse = await GroupModel.paginate(filter, options);
    return data;
  }

  async findAll(): Promise<IGroup[]> {
    const data = await GroupModel.find();
    return data;
  }

  async findById(id: string): Promise<IGroup | null> {
    const resource = await GroupModel.findOne({
      _id: id
    });

    return resource;
  }

  async findByCodeName(codename: string): Promise<IGroup | null> {
    const resource = await GroupModel.findOne({
      codename: codename
    });

    return resource;
  }

  async create(data: IGroup): Promise<IGroup> {
    //@ts-ignore
    if (await GroupModel.isNameTaken(data.name)) {
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t("MODULE_ERROR_MODULE_NAME_ALREADY_TAKEN"));
    }

    // @ts-ignore
    if (await GroupModel.isCodeNameTaken(data.codename)) {
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t("MODULE_ERROR_MODULE_codename_ALREADY_TAKEN"));
    }

    let resource = await GroupModel.create(data);

    return resource;
  }

  async update(id: string, data: IGroup): Promise<IGroup | null> {
    const ModuleDB = await this.findById(id);

    if (!ModuleDB) {
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t("MODULE_NOT_FOUND"));
    }

    //@ts-ignore
    if (await GroupModel.isNameTaken(data.name, id)) {
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t("MODULE_ERROR_ModuleNAME_ALREADY_TAKEN"));
    }

    //@ts-ignore
    if (await GroupModel.isCodeNameTaken(data.name, id)) {
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t("MODULE_ERROR_ModuleNAME_ALREADY_TAKEN"));
    }

    const dataUpdate = _.extend(ModuleDB, data);
    const result = await GroupModel.updateOne({ _id: id }, dataUpdate);

    if (!result.ok) {
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t("MODULE_ERROR_UPDATE_Module"));
    }

    const resource = await this.findById(id);

    return resource;
  }

  async delete(id: string): Promise<boolean> {
    const resource = await this.findById(id);

    if (!resource) {
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t("USERS_NOT_FOUND"));
    }

    await GroupModel.deleteOne({ _id: id });

    return true;
  }

  async bulkCreate(data: IGroup[]): Promise<boolean> {
    const dataChunk = _.chunk(data, 1000);

    for (const key in dataChunk) {
      await GroupModel.insertMany(dataChunk[key]);
    }

    return true;
  }

  async bulkDelete(ids: string[]): Promise<boolean> {
    await GroupModel.deleteMany({ _id: { $in: ids } });

    return true;
  }
}

export default new GroupService();