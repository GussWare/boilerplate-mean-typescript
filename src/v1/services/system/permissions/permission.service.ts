import { ICrudService, IPaginationOptions, IPermission, IPermissionFilter, IPaginationResponse } from '../../../../types';
import PermissionModel from '../../../db/models/system/permission.model';
import ApiError from '../../../../includes/library/api.error.library';
import _ from 'lodash';
import HttpStatus from 'http-status';

class PermissionService implements ICrudService {
  async findPaginate(filter: IPermissionFilter, options: IPaginationOptions): Promise<IPaginationResponse> {
    //@ts-ignore
    const data: IPaginationResponse = await PermissionModel.paginate(filter, ['name', 'codename'], options);
    return data;
  }

  async findAll(): Promise<IPermission[]> {
    const data = await PermissionModel.find();
    return data;
  }

  async findById(id: string): Promise<IPermission | null> {
    const resource = await PermissionModel.findOne({
      id: id
    });
    return resource;
  }

  async findByCodeName(codename: string): Promise<IPermission | null> {
    const resource = await PermissionModel.findOne({
      codename: codename
    });
    return resource;
  }

  async create(data: IPermission): Promise<IPermission> {
    //@ts-ignore
    if (await PermissionModel.isNameTaken(data.name)) {
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t('MODULE_ERROR_MODULE_NAME_ALREADY_TAKEN'));
    }

    // @ts-ignore
    if (await PermissionModel.isCodeNameTaken(data.codename)) {
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t('MODULE_ERROR_MODULE_codename_ALREADY_TAKEN'));
    }

    let resource = await PermissionModel.create(data);

    return resource;
  }

  async update(id: string, data: IPermission): Promise<IPermission | null> {
    const dataDB = await this.findById(id);

    if (!dataDB) {
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t('MODULE_NOT_FOUND'));
    }

    //@ts-ignore
    if (await PermissionModel.isNameTaken(data.name, id)) {
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t('MODULE_ERROR_ModuleNAME_ALREADY_TAKEN'));
    }

    //@ts-ignore
    if (await PermissionModel.isCodeNameTaken(data.name, id)) {
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t('MODULE_ERROR_ModuleNAME_ALREADY_TAKEN'));
    }

    const dataUpdate = _.extend(dataDB, data);
    const result = await PermissionModel.updateOne({ _id: id }, dataUpdate);

    if (!result.ok) {
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t('MODULE_ERROR_UPDATE_Module'));
    }

    const resource = await this.findById(id);

    return resource;
  }

  async delete(id: string): Promise<boolean> {
    const resource = await this.findById(id);

    if (!resource) {
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t('USERS_NOT_FOUND'));
    }

    await PermissionModel.deleteOne({ _id: id });

    return true;
  }

  async bulkCreate(data: IPermission[]): Promise<boolean> {
    const dataChunk = _.chunk(data, 1000);

    for (const key in dataChunk) {
      await PermissionModel.insertMany(dataChunk[key]);
    }

    return true;
  }

  async bulkDelete(ids: string[]): Promise<boolean> {
    await PermissionModel.deleteMany({ _id: { in: ids } });
    return true;
  }
}

export default new PermissionService();