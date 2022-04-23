import express from 'express'
import userRoute from './users.router'

const router = express.Router()

const defaultRoutes = [
  {
    path: '/v1',
    route: userRoute
  }
]

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route)
})
