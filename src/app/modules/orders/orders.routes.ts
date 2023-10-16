import express from 'express'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../../enums/user'
import { OrdersController } from './orders.controller'
const router = express.Router()

router.post('/create-order',auth(ENUM_USER_ROLE.USER), OrdersController.createOrder)
router.get('/',auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN,ENUM_USER_ROLE.USER),OrdersController.getAllOrders)
router.get('/:orderId',auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN,ENUM_USER_ROLE.USER),OrdersController.getSingleOrder)
export const OrdersRouter =router