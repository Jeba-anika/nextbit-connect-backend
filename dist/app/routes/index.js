"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_routes_1 = require("../modules/users/users.routes");
const controller_routes_1 = require("../modules/category/controller.routes");
const services_routes_1 = require("../modules/services/services.routes");
const orders_routes_1 = require("../modules/orders/orders.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/",
        route: users_routes_1.UserRouter
    },
    {
        path: '/categories',
        route: controller_routes_1.CategoryRoutes
    },
    {
        path: '/services',
        route: services_routes_1.ServicesRoutes
    },
    {
        path: '/orders',
        route: orders_routes_1.OrdersRouter
    }
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
