import { IPaginationOptions, IUser, IUserFilter } from "../../../types"
import UserModel from "../../models/user.model"
import _ from "underscore"

export default class UserService {

  constructor() {

  }

  //@ts-ignore
  async findPaginate(filter: IUserFilter, options: IPaginationOptions): Promise<IPaginationResponse> {
    //@ts-ignore
    const data: IPaginationResponse = await UserModel.paginate(filter, options);
    return data;
  }

  async findAll(): Promise<IUser[]> {
    const data = await UserModel.find();
    return data;
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await UserModel.findById(id);
    return user;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await UserModel.findOne({
      email: email
    });

    return user;
  }

  async create(data: IUser): Promise<IUser> {
    //@ts-ignore
    if (await UserModel.isEmailTaken(data.email)) {
      //@ts-ignore
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t("USERS_ERROR_EMAIL_ALREADY_TAKEN"));
    }

    //@ts-ignore
    if (await UserModel.isUsernameTaken(data.username)) {
      //@ts-ignore
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t("USERS_ERROR_USERNAME_ALREADY_TAKEN"));
    }

    let user = await UserModel.create(data);

    return user;
  }

  async update(id: string, data: IUser): Promise<IUser | null> {
    let userDB = await this.findById(id);

    if (!userDB) {
      //@ts-ignore
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t("USERS_NOT_FOUND"));
    }

    //@ts-ignore
    if (await UserModel.isEmailTaken(data.email, id)) {
      //@ts-ignore
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t("USERS_ERROR_EMAIL_ALREADY_TAKEN"));
    }

    //@ts-ignore
    if (await UserModel.isUsernameTaken(data.username, id)) {
      //@ts-ignore
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t("USERS_ERROR_USERNAME_ALREADY_TAKEN"));
    }

    let dataUpdate = _.extend(userDB, data);
    let result = await UserModel.updateOne(dataUpdate);

    if (!result.ok) {
      //@ts-ignore
      throw new ApiError(HttpStatus.BAD_REQUEST, global.polyglot.t("USERS_ERROR_UPDATE_USER"));
    }

    let user = await this.findById(id);

    return user;
  }

  async remove(): Promise<boolean> {
    return true
  }
}