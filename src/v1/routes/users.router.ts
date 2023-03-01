import express from 'express'
import UserController from '../controllers/users.controller'

const router = express.Router()

router.get('/users', UserController.findAll)

export default router
