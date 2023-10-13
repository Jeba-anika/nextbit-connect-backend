"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const orders_controller_1 = require("./orders.controller");
const router = express_1.default.Router();
router.post('/create-order', (0, auth_1.default)(user_1.ENUM_USER_ROLE.CUSTOMER), orders_controller_1.OrdersController.createOrder);
router.get('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.CUSTOMER), orders_controller_1.OrdersController.getAllOrders);
router.get('/:orderId', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.CUSTOMER), orders_controller_1.OrdersController.getSingleOrder);
exports.OrdersRouter = router;
