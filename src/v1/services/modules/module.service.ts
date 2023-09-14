import { ICrudService, IPaginationOptions, IModule, IModuleFilter } from "../../../types"
import ModuleModel from "../../models/sistema/module.model"
import * as constants from "../../../includes/config/constants"
import actionService from "./action.service";
import _ from "lodash"
import ApiError from "../../../includes/library/api.error.library";
import httpStatus from "http-status";
import loggerHelper from "../../../includes/helpers/logger.helper";

class ModuleService implements ICrudService {

  //@ts-ignore
  async findPaginate(filter: IModuleFilter, options: IPaginationOptions): Promise<IPaginationResponse> {
    //@ts-ignore
    const data: IPaginationResponse = await ModuleModel.paginate(filter, options);
    return data;
  }

  async findAll(): Promise<IModule[]> {
    const data = await ModuleModel.find();
    return data;
  }

  async findById(id: string): Promise<IModule | null> {
    const resource = await ModuleModel.findOne({
      _id: id, enabled: true
    });

    return resource;
  }

  async findBySlug(slug: string): Promise<IModule | null> {
    const resource = await ModuleModel.findOne({
      slug: slug, enabled: true
    });

    return resource;
  }

  async create(data: IModule): Promise<IModule> {
    //@ts-ignore
    if (await ModuleModel.isModuleNameTaken(data.name)) {
      //@ts-ignore
      throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("MODULE_ERROR_MODULE_NAME_ALREADY_TAKEN"));
    }

    // @ts-ignore
    if (await ModuleModel.isModuleSlugTaken(data.slug)) {
      //@ts-ignore
      throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("MODULE_ERROR_MODULE_SLUG_ALREADY_TAKEN"));
    }

    let resource = await ModuleModel.create(data);

    if (resource && data.actions) {
      loggerHelper.debug("entra aqui ");
      //@ts-ignore
      await actionService.bulkSave(resource.id, data.actions);
    }

    return resource;
  }

  async update(id: string, data: IModule): Promise<IModule | null> {
    const ModuleDB = await this.findById(id);

    if (!ModuleDB) {
      //@ts-ignore
      throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("MODULE_NOT_FOUND"));
    }

    //@ts-ignore
    if (await ModuleModel.isModuleNameTaken(data.name, id)) {
      //@ts-ignore
      throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("MODULE_ERROR_ModuleNAME_ALREADY_TAKEN"));
    }

    const dataUpdate = _.extend(ModuleDB, data);
    const result = await ModuleModel.updateOne({ _id: id }, dataUpdate);

    if (!result.ok) {
      //@ts-ignore
      throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("MODULE_ERROR_UPDATE_Module"));
    }

    const resource = await this.findById(id);

    if (resource && data.actions) {
      await actionService.bulkSave(id, data.actions);
    }

    return resource;
  }

  async delete(id: string): Promise<boolean> {
    const resource = await this.findById(id);

    if (!resource) {
      //@ts-ignore
      throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("USERS_NOT_FOUND"));
    }

    await ModuleModel.deleteOne({ _id: id });

    return true;
  }

  async enabled(id: string): Promise<boolean> {
    const resource = await this.findById(id);

    if (!resource) {
      //@ts-ignore
      throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("USERS_NOT_FOUND"));
    }

    await ModuleModel.updateOne({ _id: id }, { enabled: constants.SI });

    return true;
  }

  async disabled(id: string): Promise<boolean> {
    const resource = await this.findById(id);

    if (!resource) {
      //@ts-ignore
      throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("USERS_NOT_FOUND"));
    }

    await ModuleModel.updateOne({ _id: id }, { enabled: constants.NO });

    return true;
  }

  async bulk(data: IModule[]): Promise<boolean> {
    const dataChunk = _.chunk(data, 1000);

    for (const key in dataChunk) {
      await ModuleModel.insertMany(dataChunk[key]);
    }

    return true;
  }
}

export default new ModuleService();