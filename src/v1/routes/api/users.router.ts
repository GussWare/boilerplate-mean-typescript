import express from 'express'
import UserController from '../../controllers/api/users.controller'

const router = express.Router()

router.get('/users', UserController.findAll)

export default router
