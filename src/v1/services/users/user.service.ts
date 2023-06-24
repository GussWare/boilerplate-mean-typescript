import { ICrudService, IPaginationOptions, IUser, IUserDocument, IUserFilter } from "../../../types"
import UserModel from "../../models/sistema/user.model"
import _ from "lodash"
import httpStatus from "http-status";
import ApiError from "../../../includes/library/api.error.library";
import * as constants from "../../../includes/config/constants";

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
      email: email, enabled: constants.SI
    });

    return resource;
  }

  async create(data: IUser): Promise<IUserDocument> {
    //@ts-ignore
    if (await UserModel.isEmailTaken(data.email)) {
      //@ts-ignore
      throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("USERS_ERROR_EMAIL_ALREADY_TAKEN"));
    }

    //@ts-ignore
    if (await UserModel.isUserNameTaken(data.username)) {
      //@ts-ignore
      throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("USERS_ERROR_USERNAME_ALREADY_TAKEN"));
    }

    let resource = await UserModel.create(data);

    return resource;
  }

  async update(id: string, data: IUser): Promise<IUserDocument | null> {
    let dataDB = await this.findById(id);

    if (!dataDB) {
      //@ts-ignore
      throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("USERS_NOT_FOUND"));
    }

    //@ts-ignore
    if (await UserModel.isEmailTaken(data.email, id)) {
      //@ts-ignore
      throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("USERS_ERROR_EMAIL_ALREADY_TAKEN"));
    }

    //@ts-ignore
    if (await UserModel.isUserNameTaken(data.username, id)) {
      //@ts-ignore
      throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("USERS_ERROR_USERNAME_ALREADY_TAKEN"));
    }

    let dataUpdate = _.extend(dataDB, data);
    let result = await UserModel.updateOne({ _id: id }, dataUpdate);

    if (!result.ok) {
      //@ts-ignore
      throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("USERS_ERROR_UPDATE_USER"));
    }

    let resource = await this.findById(id);

    return resource;
  }

  async enabled(id: string): Promise<boolean> {
    const resource = await this.findById(id);

    if (!resource) {
      //@ts-ignore
      throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("USERS_NOT_FOUND"));
    }

    await UserModel.updateOne({ _id: id }, { enabled: constants.SI });

    return true;
  }

  async disabled(id: string): Promise<boolean> {
    const resource = await this.findById(id);

    if (!resource) {
      //@ts-ignore
      throw new ApiError(httpStatus.BAD_REQUEST, global.polyglot.t("USERS_NOT_FOUND"));
    }

    await UserModel.updateOne({ _id: id }, { enabled: constants.NO });

    return true;
  }

  async bulk(data: IUser[]): Promise<boolean> {
    const dataChunk = _.chunk(data, 1000);

    for (const key in dataChunk) {
      await UserModel.insertMany(dataChunk[key]);
    }

    return true;
  }
}

export default new UserService();