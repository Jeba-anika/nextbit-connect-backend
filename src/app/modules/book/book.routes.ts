import express from 'express'
import { BookController } from './book.controller'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../../enums/user'
// import auth from '../../middlewares/auth'
// import { ENUM_USER_ROLES } from '../../enums/user'
const router = express.Router()


router.post('/create-book',auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), BookController.createBook)
router.get('/', BookController.getAllBooks)
router.get('/:id', BookController.getSingleBook)
router.patch('/:id',auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), BookController.updateBook)
router.delete('/:id',auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN), BookController.deleteBook)
router.get('/:categoryId/category', BookController.getAllBooksByCategory)

export const BookRoutes = router
