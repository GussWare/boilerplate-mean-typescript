import userService from "./user.service"
import tokenService from "../token/token.service";
import httpStatus from "http-status";
import TokenModel from "../../models/sistema/token.model";
import ApiError from "../../../includes/library/api.error.library";
import * as constants from "../../../includes/config/constants";
import { IAccessToken, IUser, IUserDocument } from "../../../types";

class AuthService {

    async login(email: string, password: string): Promise<IUserDocument> {
        const user = await userService.findByEmail(email);

        if (!user || !user.enabled) {
            //@ts-ignore
            throw new ApiError(httpStatus.UNAUTHORIZED, "USERS_ERROR_USER_NOT_FOUND");
        }

        //@ts-ignore
        const isPassWordMatch = await user.isPasswordMatch(password);

        if (!isPassWordMatch) {
            //@ts-ignore
            throw new ApiError(httpStatus.UNAUTHORIZED, global.polyglot.t("USERS_ERROR_INCORRECT_EMAIL_AND_OR_PASSWORD"));
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
        const refreshTokenDoc = await tokenService.verify(refreshToken, constants.TOKEN_TYPE_REFRESH);
        const user = await userService.findById(refreshTokenDoc.user);

        if (!user || !user.enabled) {
            //@ts-ignore
            throw new ApiError(httpStatus.UNAUTHORIZED, global.polyglot.t("AUTH_ERROR_PLEASE_AUTHENTICATE"));
        }

        await refreshTokenDoc.remove();

        const tokens = await tokenService.generateTokenAuthentication(user);

        return tokens;
    }

    async resetPassword(resetPassword: any , newPassword: string): Promise<boolean> {
        if(! resetPassword) 
            return false;

        const resetPasswordTokenDB = await tokenService.verify(resetPassword, constants.TOKEN_TYPE_RESET_PASSWORD);
        const user = await userService.findById(resetPasswordTokenDB.user);

        if (!user || !user.enabled) {
            //@ts-ignore
            throw new ApiError(httpStatus.UNAUTHORIZED, global.polyglot.t("AUTH_ERROR_PLEASE_AUTHENTICATE"));
        }

        const data = { password: newPassword };

        await userService.update(user.id, data);

        await TokenModel.deleteMany({
            user: user.id,
            type: constants.TOKEN_TYPE_RESET_PASSWORD
        });

        return true;
    }

    async verifyEmail(tokenVerifyEmail: any): Promise<boolean> {
        const verifyEmailDoc = await tokenService.verify(tokenVerifyEmail, constants.TOKEN_TYPE_VERIFY_EMAIL);

        const user = await userService.findById(verifyEmailDoc.user);

        if (!user || user.enabled) {
            //@ts-ignore
            throw new ApiError(httpStatus.UNAUTHORIZED, global.polyglot.t("AUTH_ERROR_PLEASE_AUTHENTICATE"));
        }

        await TokenModel.deleteMany({
            user: user.id,
            type: constants.TOKEN_TYPE_VERIFY_EMAIL
        });

        const data: IUser = {
            isEmailVerified: true
        }

        await userService.update(user.id, data);

        return true;
    }
}

export default new AuthService();