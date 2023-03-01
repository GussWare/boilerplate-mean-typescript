import express from 'express'
import userRoute from './users.router'
import config from "../../includes/config/config"
import * as constants from "../../includes/config/constants"

const router = express.Router()

const defaultRoutes = [
  {
    path: '/v1',
    route: userRoute
  }
]

const devRoutes:any = [

]

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* no agregar en produccion */
if (config.env === constants.NODE_ENV_DEVELOPER) {
  devRoutes.forEach((route: any) => {
    router.use(route.path, route.route);
  });
}

export default router;