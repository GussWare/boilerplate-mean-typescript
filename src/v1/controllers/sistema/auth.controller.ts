import { Request, Response } from "express";
import userService from "../../services/users/user.service";
import tokenService from "../../services/token/token.service";
import authService from "../../services/users/auth.service";
import resetPasswordEmail from "../../services/emails/ResetPasswordEmail";
import verificationEmail from "../../services/emails/VerificationEmail";
import httpStatus from "http-status";
import { IUser } from "../../../types";

class AuthController {

    async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        const user = await authService.login(email, password);
        const tokens = await tokenService.generateTokenAuthentication(user);
        
        res.status(httpStatus.OK).json({ user, tokens });
    }

    async logout(req: Request, res: Response): Promise<void> {
        await authService.logout(req.body.refreshToken);

        res.status(httpStatus.OK).send();
    }

    async register(req: Request, res: Response): Promise<void> {
        const user = await userService.create(req.body);
        const tokens = await tokenService.generateTokenAuthentication(user);

        res.status(httpStatus.CREATED).json({ user, tokens });
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        const { refreshToken } = req.body;
        const tokens = await authService.refreshAuth(refreshToken);

        res.status(httpStatus.OK).json({ ...tokens });
    }

    async forgotPassword(req: Request, res: Response): Promise<void> {
        const { email } = req.body;
        const resetPassword = await tokenService.generateTokenResetPassword(email);

        await resetPasswordEmail.send(email, resetPassword);

        res.status(httpStatus.NO_CONTENT).send();
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        const { token } = req.query;
        const { password } = req.body;

        await authService.resetPassword(token, password);

        res.status(httpStatus.NO_CONTENT).send();
    }

    async sendVerifiedEmail(req: Request, res: Response): Promise<void> {
        const user = req.user as IUser;
        const verifyEmailToken = await tokenService.generateTokenVerifyEmail(user);

        await verificationEmail.send(user.email, verifyEmailToken);

        res.status(httpStatus.NO_CONTENT).send();
    }

    async verifyEmail(req: Request, res: Response): Promise<void> {

        const { token } = req.query;

        await authService.verifyEmail(token);

        res.status(httpStatus.NO_CONTENT).send();
    }
}

export default new AuthController();