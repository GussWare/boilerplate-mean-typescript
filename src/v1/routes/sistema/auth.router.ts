import express from 'express'
import catchAsyncHelper from '../../../includes/helpers/error.helper';
import AuthController from '../../controllers/sistema/auth.controller'
import { forgotPasswordValidation, loginValidation, logoutValidation, refreshTokensValidation, registerValidation } from "../../validations/sistema/auth/auth.validation";

const router = express.Router()

router.post('/login', [loginValidation], catchAsyncHelper(AuthController.login));
router.post('/logout', [logoutValidation], catchAsyncHelper(AuthController.logout));
router.post('/register', [registerValidation], catchAsyncHelper(AuthController.register));
router.post('/forgot-password', [forgotPasswordValidation], catchAsyncHelper(AuthController.forgotPassword));
router.post('/refresh-token', [refreshTokensValidation], catchAsyncHelper(AuthController.refreshToken));

/*
router.post('/resetPassword', [reset], catchAsyncHelper(AuthController.resetPassword));
router.post('/sendVerifiedEmail', validateMiddleware(authValidation.sendVerifiedEmail), catchAsyncHelper(AuthController.sendVerifiedEmail));
router.post('/verifyEmail', validateMiddleware(authValidation.verifyEmail), catchAsyncHelper(AuthController.verifyEmail));
*/

export default router
