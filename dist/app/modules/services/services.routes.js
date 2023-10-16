"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const services_controller_1 = require("./services.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
// import auth from '../../middlewares/auth'
// import { ENUM_USER_ROLES } from '../../enums/user'
const router = express_1.default.Router();
router.post('/create-service', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), services_controller_1.ServiceController.createService);
router.post('/review-rating', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.USER), services_controller_1.ServiceController.giveReviewRating);
router.get('/review-rating', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.USER), services_controller_1.ServiceController.getAllReviewRatings);
router.get('/', services_controller_1.ServiceController.getAllServices);
router.get('/:id', services_controller_1.ServiceController.getSingleService);
router.patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), services_controller_1.ServiceController.updateService);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), services_controller_1.ServiceController.deleteService);
router.get('/:categoryId/category', services_controller_1.ServiceController.getAllServicesByCategory);
exports.ServicesRoutes = router;
