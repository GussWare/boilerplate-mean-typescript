import { Request, Response } from "express";
import UserService from "../../services/system/users/user.service";
import TokenService from "../../services/system/token/token.service";
import AuthService from "../../services/system/users/auth.service";
import ResetPasswordEmail from "../../services/system/emails/ResetPasswordEmail";
import VerificationEmail from "../../services/system/emails/VerificationEmail";
import HttpStatus from "http-status";
import { IUser } from "../../../types";

class AuthController {

    async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        const user = await AuthService.login(email, password);
        const tokens = await TokenService.generateTokenAuthentication(user);
        
        res.status(HttpStatus.OK).json({ user, tokens });
    }

    async logout(req: Request, res: Response): Promise<void> {
        await AuthService.logout(req.body.refreshToken);

        res.status(HttpStatus.OK).send();
    }

    async register(req: Request, res: Response): Promise<void> {
        const user = await UserService.create(req.body);
        const tokens = await TokenService.generateTokenAuthentication(user);

        res.status(HttpStatus.CREATED).json({ user, tokens });
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        const { refreshToken } = req.body;
        const tokens = await AuthService.refreshAuth(refreshToken);

        res.status(HttpStatus.OK).json({ ...tokens });
    }

    async forgotPassword(req: Request, res: Response): Promise<void> {
        const { email } = req.body;
        const resetPassword = await TokenService.generateTokenResetPassword(email);

        await ResetPasswordEmail.send(email, resetPassword);

        res.status(HttpStatus.NO_CONTENT).send();
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        const { token } = req.query;
        const { password } = req.body;

        await AuthService.resetPassword(token, password);

        res.status(HttpStatus.NO_CONTENT).send();
    }

    async sendVerifiedEmail(req: Request, res: Response): Promise<void> {
        const user = req.user as IUser;
        const verifyEmailToken = await TokenService.generateTokenVerifyEmail(user);

        await VerificationEmail.send(user.email, verifyEmailToken);

        res.status(HttpStatus.NO_CONTENT).send();
    }

    async verifyEmail(req: Request, res: Response): Promise<void> {

        const { token } = req.query;

        await AuthService.verifyEmail(token);

        res.status(HttpStatus.NO_CONTENT).send();
    }
}

export default new AuthController();