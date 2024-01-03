import { ICrudService, IPaginationOptions, IUser, IUserDocument, IUserFilter } from "../../../../types"
import UserModel from "../../../db/models/system/user.model";
import HttpStatus from "http-status";
import ApiError from "../../../../includes/library/api.error.library";
import * as constants from "../../../../includes/config/constants";
import _ from "lodash"

class UserService implements ICrudService {

  //@ts-ignore
  async findPaginate(filter: IUserFilter, options: IPaginationOptions): Promise<IPaginationResponse> {
    //@ts-ignore
    const data: IPaginationResponse = await UserModel.paginate(filter, options);
    return data;
  }

  async findAll(): Promise<IUserDocument[]> {
    const data = await UserModel.find();
    return data;
  }

  async findById(id: string): Promise<IUserDocument | null> {
    const resource = await UserModel.findById(id);
    return resource;
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    const resource = await UserModel.findOne({
      email: email, is_active: constants.SI
    });

    return resource;
  }

  async create(data: IUser): Promise<IUserDocument> {
    //@ts-ignore
    if (await UserModel.isEmailTaken(data.email)) {      
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t("USERS_ERROR_EMAIL_ALREADY_TAKEN"));
    }

    //@ts-ignore
    if (await UserModel.isUserNameTaken(data.username)) {
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t("USERS_ERROR_USERNAME_ALREADY_TAKEN"));
    }

    let resource = await UserModel.create(data);

    return resource;
  }

  async update(id: string, data: IUser): Promise<IUserDocument | null> {
    let dataDB = await this.findById(id);

    if (!dataDB) {
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t("USERS_NOT_FOUND"));
    }

    //@ts-ignore
    if (await UserModel.isEmailTaken(data.email, id)) {
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t("USERS_ERROR_EMAIL_ALREADY_TAKEN"));
    }

    //@ts-ignore
    if (await UserModel.isUserNameTaken(data.username, id)) {
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t("USERS_ERROR_USERNAME_ALREADY_TAKEN"));
    }

    let dataUpdate = _.extend(dataDB, data);
    let result = await UserModel.updateOne({ _id: id }, dataUpdate);

    if (!result.ok) {
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t("USERS_ERROR_UPDATE_USER"));
    }

    let resource = await this.findById(id);

    return resource;
  }

  async enabled(id: string): Promise<boolean> {
    const resource = await this.findById(id);

    if (!resource) {
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t("USERS_NOT_FOUND"));
    }

    await UserModel.updateOne({ _id: id }, { is_active: constants.SI });

    return true;
  }

  async disabled(id: string): Promise<boolean> {
    const resource = await this.findById(id);

    if (!resource) {
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t("USERS_NOT_FOUND"));
    }

    await UserModel.updateOne({ _id: id }, { is_active: constants.NO });

    return true;
  }

  async delete(id: string): Promise<boolean> {
    const resource = await this.findById(id);

    if (!resource) {
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t("USERS_NOT_FOUND"));
    }

    await UserModel.deleteOne({ _id: id });

    return true;
  }

  async bulkCreate(data: IUser[]): Promise<boolean> {
    const dataChunk = _.chunk(data, 1000);

    for (const key in dataChunk) {
      await UserModel.insertMany(dataChunk[key]);
    }

    return true;
  }

  async bulkDelete(ids: string[]): Promise<boolean> {
    await UserModel.deleteMany({ _id: { $in: ids } });

    return true;
  }
}

export default new UserService();