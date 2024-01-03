import express from 'express'
import TestController from '../../controllers/sistema/test.controller'

const router = express.Router()

router.get('/faker', TestController.faker)

export default router
