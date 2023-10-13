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
exports.OrdersService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const createOrder = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.create({
        data: {
            userId,
            orderedBooks: payload,
        },
    });
    return result;
});
const getAllOrders = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    let result = [];
    if (role === 'admin') {
        result = yield prisma_1.default.order.findMany({});
    }
    else if (role === 'customer') {
        result = yield prisma_1.default.order.findMany({
            where: {
                userId,
            },
        });
    }
    return result;
});
const getSingleOrder = (orderId, userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.findUnique({
        where: {
            id: orderId,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Order does not exist!');
    }
    if (role === 'customer') {
        if ((result === null || result === void 0 ? void 0 : result.userId) !== userId) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Unauthorized access');
        }
    }
    return result;
});
exports.OrdersService = {
    createOrder,
    getAllOrders,
    getSingleOrder,
};
