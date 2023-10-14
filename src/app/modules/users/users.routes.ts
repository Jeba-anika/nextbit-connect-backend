import express from 'express'
import { UserController } from './users.controller'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../../enums/user'
const router = express.Router()


router.post('/auth/signup', UserController.createUser)
router.post('/auth/signin', UserController.userLogin)
router.post('/auth/refresh-token', UserController.userRefreshToken)
router.get('/users',auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), UserController.getAllUsers)
router.get('/users/:id',auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER), UserController.getUser)
router.patch('/users/:id',auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER), UserController.updateUser)
router.delete('/users/:id',auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), UserController.deleteUser)
router.get('/profile/:id',auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER), UserController.getProfile)




export const UserRouter = router
