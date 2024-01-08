import express from 'express'
import authRoute from './auth.router'
import userRoute from './users.router'
import groupRoute from './group.router'
import testRoute from './test.router'
import config from "../../../includes/config/config"
import * as constants from "../../../includes/config/constants"

const router = express.Router()

const defaultRoutes = [
  {
    path: '/v1/users',
    route: userRoute
  },
  {
    path: '/v1/auth',
    route: authRoute
  },
  {
    path: '/v1/groups',
    route: groupRoute
  }
]

const devRoutes:any = [
  {
    path: '/v1',
    route: testRoute
  }
]

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

if (config.env === constants.NODE_ENV_DEVELOPER) {
  devRoutes.forEach((route: any) => {
    router.use(route.path, route.route);
  });
}

export default router;