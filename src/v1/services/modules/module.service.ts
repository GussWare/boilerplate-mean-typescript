import { ICrudService, IPaginationOptions, IModule, IModuleFilter } from "../../../types"
import ModuleModel from "../../models/api/module.model"
import _ from "lodash"

class ModuleService implements ICrudService<IModule> {

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
    const data = await ModuleModel.findOne({
      _id: id, enabled: true
    });
    return data;
  }

  async findBySlug(slug: string): Promise<IModule | null> {
    const data = await ModuleModel.findOne({
      slug: slug, enabled: true
    });

    return data;
  }

  async create(data: IModule): Promise<IModule> {
    //@ts-ignore
    if (await ModuleModel.isModuleNameTaken(data.name)) {
      //@ts-ignore
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t("MODULE_ERROR_ModuleNAME_ALREADY_TAKEN"));
    }

    let Module = await ModuleModel.create(data);

    return Module;
  }

  async update(id: string, data: IModule): Promise<IModule | null> {
    let ModuleDB = await this.findById(id);

    if (!ModuleDB) {
      //@ts-ignore
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t("MODULE_NOT_FOUND"));
    }

    //@ts-ignore
    if (await ModuleModel.isModuleNameTaken(data.name, id)) {
      //@ts-ignore
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t("MODULE_ERROR_ModuleNAME_ALREADY_TAKEN"));
    }

    let dataUpdate = _.extend(ModuleDB, data);
    let result = await ModuleModel.updateOne({_id: id}, dataUpdate);

    if (!result.ok) {
      //@ts-ignore
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t("MODULE_ERROR_UPDATE_Module"));
    }

    let Module = await this.findById(id);

    return Module;
  }

  async enabled(_id: string): Promise<boolean> {
    return true
  }

  async disabled(_id: string): Promise<boolean> {
    return true
  }

  async bulk(_data: IModule[]): Promise<boolean> {
    return true;
  }
}

export default new ModuleService();