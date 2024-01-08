import express from 'express'
import GroupController from '../../controllers/system/group.controller'
import catchAsyncHelper from '../../../includes/helpers/error.helper';
import validateMiddleware from '../../../includes/middelware/validation.middleware';
import { GroupCreateValidation, GroupByIdValidation, GroupUpdateValidation } from '../../validations/system/group/group.validation';

const router = express.Router()

router.get('/pagination', catchAsyncHelper(GroupController.findPagination));
router.get('/', catchAsyncHelper(GroupController.findAll));
router.get('/:id', [validateMiddleware(GroupByIdValidation)], catchAsyncHelper(GroupController.findById));
router.post('/create', [validateMiddleware(GroupCreateValidation)], catchAsyncHelper(GroupController.create));
router.put('/:id/update', [validateMiddleware(GroupUpdateValidation)], catchAsyncHelper(GroupController.update));
router.delete('/:id/delete', [validateMiddleware(GroupByIdValidation)], catchAsyncHelper(GroupController.delete));

export default router
