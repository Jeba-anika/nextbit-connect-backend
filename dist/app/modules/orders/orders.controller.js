"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const orders_service_1 = require("./orders.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const createOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield orders_service_1.OrdersService.createOrder((_b = req.body) === null || _b === void 0 ? void 0 : _b.orderedBooks, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order created successfully!',
        data: result
    });
}));
const getAllOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const result = yield orders_service_1.OrdersService.getAllOrders((_c = req.user) === null || _c === void 0 ? void 0 : _c.userId, (_d = req.user) === null || _d === void 0 ? void 0 : _d.role);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Orders fetched successfully!',
        data: result
    });
}));
const getSingleOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    const result = yield orders_service_1.OrdersService.getSingleOrder(req.params.orderId, (_e = req.user) === null || _e === void 0 ? void 0 : _e.userId, (_f = req.user) === null || _f === void 0 ? void 0 : _f.role);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order fetched successfully!',
        data: result
    });
}));
exports.OrdersController = {
    createOrder,
    getAllOrders,
    getSingleOrder
};
