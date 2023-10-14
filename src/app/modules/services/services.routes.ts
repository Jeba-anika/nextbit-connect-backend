import express from 'express'
import { ServiceController } from './services.controller'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../../enums/user'
// import auth from '../../middlewares/auth'
// import { ENUM_USER_ROLES } from '../../enums/user'
const router = express.Router()


router.post('/create-service',auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), ServiceController.createService)
router.get('/', ServiceController.getAllServices)
router.get('/:id', ServiceController.getSingleService)
router.patch('/:id',auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), ServiceController.updateService)
router.delete('/:id',auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN), ServiceController.deleteService)
router.get('/:categoryId/category', ServiceController.getAllServicesByCategory)

export const ServicesRoutes = router
