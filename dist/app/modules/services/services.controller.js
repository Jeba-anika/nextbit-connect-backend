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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
// import { IBook } from './book.interface'
const services_service_1 = require("./services.service");
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const services_constants_1 = require("./services.constants");
// import pick from '../../../shared/pick'
// import { bookFilterableFields } from './book.constants'
// import { paginationFields } from '../../../constants/pagination'
const createService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //   const userInfo = req.user
    const serviceData = __rest(req.body, []);
    const result = yield services_service_1.ServicesProvidedService.createService(serviceData);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'Service created successfully',
        statusCode: 200,
        data: result,
    });
}));
const getAllServices = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = (0, pick_1.default)(req.query, ['size', 'page', 'sortBy', 'sortOrder']);
    const filters = (0, pick_1.default)(req.query, services_constants_1.serviceFilterableFields);
    const result = yield services_service_1.ServicesProvidedService.getAllServices(options, filters);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Services fetched  successfully',
        data: result,
    });
}));
const getAllServicesByCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = (0, pick_1.default)(req.query, ['size', 'page', 'sortBy', 'sortOrder']);
    const filters = (0, pick_1.default)(req.query, services_constants_1.serviceFilterableFields);
    const result = yield services_service_1.ServicesProvidedService.getAllServicesByCategory(req.params.categoryId, options, filters);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Services with associated category data fetched successfully',
        data: result,
    });
}));
const getSingleService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield services_service_1.ServicesProvidedService.getSingleService(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Service fetched successfully',
        data: result,
    });
}));
const updateService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updatedService = req.body;
    const result = yield services_service_1.ServicesProvidedService.updateService(id, updatedService);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Service edited successfully',
        data: result,
    });
}));
const deleteService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield services_service_1.ServicesProvidedService.deleteService(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Service deleted successfully',
        data: result,
    });
}));
const giveReviewRating = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield services_service_1.ServicesProvidedService.giveReviewRating(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Review and rating submitted!',
        data: result,
    });
}));
const getAllReviewRatings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, userId } = req.user;
    const result = yield services_service_1.ServicesProvidedService.getAllReviewRatings(role, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All review & ratings fetched!',
        data: result,
    });
}));
// const addToWishlist = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id
//   const userInfo = req.user
//   await BookService.addToWishlist(id, userInfo)
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Added to wishlist',
//   })
// })
// const addToCurrentlyReading = catchAsync(
//   async (req: Request, res: Response) => {
//     const id = req.params.id
//     const userInfo = req.user
//     await BookService.addToCurrentlyReading(id, userInfo)
//     sendResponse(res, {
//       statusCode: 200,
//       success: true,
//       message: 'Added to currently reading',
//     })
//   }
// )
// const addToPlanToReadSoon = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id
//   const userInfo = req.user
//   await BookService.addToPlanToReadSoon(id, userInfo)
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Added to plan to read soon',
//   })
// })
// const setFinishedReading = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id
//   const userInfo = req.user
//   await BookService.setFinishedReading(id, userInfo)
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Removed from wishlist',
//   })
// })
// const addReview = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id
//   const { review } = req.body
//   await BookService.addReview(id, review)
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Review added',
//   })
// })
exports.ServiceController = {
    createService,
    getAllServices,
    getAllServicesByCategory,
    getSingleService,
    updateService,
    deleteService,
    giveReviewRating,
    getAllReviewRatings
    //   addToWishlist,
    //   addToCurrentlyReading,
    //   addToPlanToReadSoon,
    //   setFinishedReading,
    //   addReview,
};
