import express from 'express';
import { UserRouter } from '../modules/users/users.routes';
import { CategoryRoutes } from '../modules/category/controller.routes';
import { ServicesRoutes } from '../modules/services/services.routes';


const router = express.Router();

const moduleRoutes = [
  {
    path: "/",
    route: UserRouter
  }
  ,
  {
    path: '/categories',
    route: CategoryRoutes
  }
  ,
  {
    path: '/services',
    route: ServicesRoutes
  }
  // ,
  // {
  //   path: '/orders',
  //   route: OrdersRouter
  // }
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
