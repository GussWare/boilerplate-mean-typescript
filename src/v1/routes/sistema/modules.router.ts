import express from 'express'
import ModulesController from '../../controllers/sistema/modules.controller'
import ActionsController from '../../controllers/sistema/actions.controller'
import catchAsyncHelper from '../../../includes/helpers/error.helper';

import * as ModuleValidation from "../../validations/sistema/modules/modules.validation";

const router = express.Router()

router.get('/paginate', catchAsyncHelper(ModulesController.findPaginate));
router.get('/', catchAsyncHelper(ModulesController.findAll));
router.get('/:id', catchAsyncHelper(ModulesController.findById));
router.post('/',[ModuleValidation.createValidation], catchAsyncHelper(ModulesController.create));
router.put('/:id', catchAsyncHelper(ModulesController.update));
router.put('/:id/enabled', catchAsyncHelper(ModulesController.enabled));
router.put('/:id/disabled', catchAsyncHelper(ModulesController.disabled));


router.get('/:moduleId/actions/paginate', catchAsyncHelper(ActionsController.findPaginate));
router.get('/:moduleId/actions/', catchAsyncHelper(ActionsController.findAll));

export default router
