import UserService from "./user.service"
import TokenService from "../token/token.service";
import httpStatus from "http-status";
import TokenModel from "../../../db/models/system/token.model";
import ApiError from "../../../../includes/library/api.error.library";
import * as constants from "../../../../includes/config/constants";
import { IAccessToken, IUser, IUserDocument } from "../../../../types";

class AuthService {

    async login(email: string, password: string): Promise<IUserDocument> {
        const user = await UserService.findByEmail(email);

        if (!user || !user.is_active) {
            //@ts-ignore
            throw new ApiError(httpStatus.UNAUTHORIZED, "USERS_ERROR_USER_NOT_FOUND");
        }

        //@ts-ignore
        const isPassWordMatch = await user.isPasswordMatch(password);

        if (!isPassWordMatch) {
            //@ts-ignore
            throw new ApiError(httpStatus.UNAUTHORIZED, global.polyglot.t("AUTH_ERROR_INCORRECT_EMAIL_AND_OR_PASSWORD"));
        }

        return user;
    }

    async logout(refreshToken: string): Promise<boolean> {
        const refreshTokenDoc = await TokenModel.findOne({
            token: refreshToken,
            type: constants.TOKEN_TYPE_REFRESH,
            blacklisted: false,
        });

        if (!refreshTokenDoc) {
            //@ts-ignore
            throw new ApiError(httpStatus.NOT_FOUND, global.polyglot.t("GENERAL_ERROR_NOT_FOUND"));
        }

        await refreshTokenDoc.remove();

        return true;
    }

    async refreshAuth(refreshToken: string): Promise<IAccessToken> {
        //@ts-ignore
        const refreshTokenDoc = await TokenService.verify(refreshToken, constants.TOKEN_TYPE_REFRESH);
        const user = await UserService.findById(refreshTokenDoc.user);

        if (!user || !user.is_active) {
            //@ts-ignore
            throw new ApiError(httpStatus.UNAUTHORIZED, global.polyglot.t("AUTH_ERROR_PLEASE_AUTHENTICATE"));
        }

        await refreshTokenDoc.remove();

        const tokens = await TokenService.generateTokenAuthentication(user);

        return tokens;
    }

    async resetPassword(resetPassword: any , newPassword: string): Promise<boolean> {
        if(! resetPassword) 
            return false;

        const resetPasswordTokenDB = await TokenService.verify(resetPassword, constants.TOKEN_TYPE_RESET_PASSWORD);
        const user = await UserService.findById(resetPasswordTokenDB.user);

        if (!user || !user.is_active) {
            //@ts-ignore
            throw new ApiError(httpStatus.UNAUTHORIZED, global.polyglot.t("AUTH_ERROR_PLEASE_AUTHENTICATE"));
        }

        const data = { password: newPassword };

        await UserService.update(user.id, data);

        await TokenModel.deleteMany({
            user: user.id,
            type: constants.TOKEN_TYPE_RESET_PASSWORD
        });

        return true;
    }

    async verifyEmail(tokenVerifyEmail: any): Promise<boolean> {
        const verifyEmailDoc = await TokenService.verify(tokenVerifyEmail, constants.TOKEN_TYPE_VERIFY_EMAIL);

        const user = await UserService.findById(verifyEmailDoc.user);

        if (!user || user.is_active) {
            //@ts-ignore
            throw new ApiError(httpStatus.UNAUTHORIZED, global.polyglot.t("AUTH_ERROR_PLEASE_AUTHENTICATE"));
        }

        await TokenModel.deleteMany({
            user: user.id,
            type: constants.TOKEN_TYPE_VERIFY_EMAIL
        });

        const data: IUser = {
            is_email_verified: true
        }

        await UserService.update(user.id, data);

        return true;
    }
}

export default new AuthService();