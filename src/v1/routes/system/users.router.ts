import express from 'express'
import UserController from '../../controllers/system/users.controller'
import { UserCreateValidation, UserUpdateValidation, UserByIdValidation } from '../../validations/system/users/user.validation'
import validateMiddleware from '../../../includes/middelware/validation.middleware'

const router = express.Router()

router.get('/', UserController.findAll)
router.get('/pagination', UserController.findPagination)
router.get('/:id', [validateMiddleware(UserByIdValidation)], UserController.findById)
router.post('/create', [validateMiddleware(UserCreateValidation)], UserController.create)
router.put('/:id/update', [validateMiddleware(UserUpdateValidation)], UserController.update)
router.delete('/:id/delete', [validateMiddleware(UserByIdValidation)], UserController.delete)
router.put('/:id/enabled', [validateMiddleware(UserByIdValidation)], UserController.enabled)
router.put('/:id/disabled', [validateMiddleware(UserByIdValidation)], UserController.disabled)

export default router
