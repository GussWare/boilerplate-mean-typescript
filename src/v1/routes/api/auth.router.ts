import express from 'express'
import catchAsyncHelper from '../../../includes/helpers/error.helper';
import validateMiddleware from '../../../includes/middelware/validation.middleware';
import AuthController from '../../controllers/api/auth.controller'
import * as authValidation from "../../validations/auth.validation";

const router = express.Router()

router.post('/login', validateMiddleware(authValidation.login), catchAsyncHelper(AuthController.login));
router.post('/logout', validateMiddleware(authValidation.logout), catchAsyncHelper(AuthController.logout));
router.post('/register', validateMiddleware(authValidation.register), catchAsyncHelper(AuthController.register));
router.post('/forgotPassword', validateMiddleware(authValidation.forgotPassword), catchAsyncHelper(AuthController.forgotPassword));
router.post('/refreshToken', validateMiddleware(authValidation.refreshTokens), catchAsyncHelper(AuthController.refreshToken));
router.post('/resetPassword', validateMiddleware(authValidation.resetPassword), catchAsyncHelper(AuthController.resetPassword));
router.post('/sendVerifiedEmail', validateMiddleware(authValidation.sendVerifiedEmail), catchAsyncHelper(AuthController.sendVerifiedEmail));
router.post('/verifyEmail', validateMiddleware(authValidation.verifyEmail), catchAsyncHelper(AuthController.verifyEmail));

export default router
