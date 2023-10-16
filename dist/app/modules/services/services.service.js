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
exports.ServicesProvidedService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const services_constants_1 = require("./services.constants");
const createService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.service.create({
        data,
        include: {
            category: true,
        },
    });
    return result;
});
const getAllServices = (options, filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, skip, size, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { search, minPrice, maxPrice, category, location } = filters, filtersData = __rest(filters, ["search", "minPrice", "maxPrice", "category", "location"]);
    const andConditions = [];
    if (search) {
        andConditions.push({
            OR: services_constants_1.serviceSearchableFields.map(field => ({
                [field]: {
                    contains: search,
                    mode: 'insensitive',
                },
            })),
        });
    }
    if (Object.keys(filtersData).length > 0) {
        andConditions.push({
            AND: Object.keys(filtersData).map(key => ({
                [key]: filtersData[key],
            })),
        });
    }
    if (minPrice) {
        andConditions.push({
            price: {
                gte: Number(minPrice),
            },
        });
    }
    if (maxPrice) {
        andConditions.push({
            price: {
                lte: Number(maxPrice),
            },
        });
    }
    if (category) {
        andConditions.push({
            categoryId: category,
        });
    }
    if (location) {
        andConditions.push({
            location: location,
        });
    }
    const whereCondition = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.service.findMany({
        where: whereCondition,
        take: size,
        skip,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = yield prisma_1.default.service.count();
    return {
        meta: {
            page,
            size,
            total,
            totalPage: Math.ceil(total / size),
        },
        data: result,
    };
});
const getAllServicesByCategory = (categoryId, options, filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, skip, size, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { search, minPrice, maxPrice, category } = filters, filtersData = __rest(filters, ["search", "minPrice", "maxPrice", "category"]);
    const andConditions = [];
    andConditions.push({
        categoryId,
    });
    if (search) {
        andConditions.push({
            OR: services_constants_1.serviceSearchableFields.map(field => ({
                [field]: {
                    contains: search,
                    mode: 'insensitive',
                },
            })),
        });
    }
    if (Object.keys(filtersData).length > 0) {
        andConditions.push({
            AND: Object.keys(filtersData).map(key => ({
                [key]: filtersData[key],
            })),
        });
    }
    if (minPrice) {
        andConditions.push({
            price: {
                gte: Number(minPrice),
            },
        });
    }
    if (maxPrice) {
        andConditions.push({
            price: {
                lte: Number(maxPrice),
            },
        });
    }
    if (category) {
        andConditions.push({
            categoryId: category,
        });
    }
    const whereCondition = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.service.findMany({
        where: whereCondition,
        take: size,
        skip,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = yield prisma_1.default.service.count();
    return {
        meta: {
            page,
            size,
            total,
            totalPage: Math.ceil(total / size),
        },
        data: result,
    };
});
const getSingleService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.service.findUnique({ where: { id } });
    return result;
});
const updateService = (id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.service.update({
        where: {
            id,
        },
        data: updatedData,
    });
    return result;
});
const deleteService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.service.delete({
        where: { id },
    });
    return result;
});
const giveReviewRating = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    let result = {};
    yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        result = yield transactionClient.reviewAndRating.create({
            data: payload,
            include: {
                service: true,
            },
        });
        const avgRating = yield transactionClient.reviewAndRating.aggregate({
            _avg: {
                rating: true,
            },
            where: {
                serviceId: result === null || result === void 0 ? void 0 : result.serviceId,
            },
        });
        const updatedData = yield transactionClient.service.update({
            where: {
                id: result === null || result === void 0 ? void 0 : result.serviceId,
            },
            data: {
                rating: Number((_a = avgRating._avg.rating) === null || _a === void 0 ? void 0 : _a.toFixed(2)),
            },
        });
        console.log(updatedData, result);
        return result;
    }));
    return result;
});
const getAllReviewRatings = (role, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (role === client_1.UserRole.admin || role === client_1.UserRole.super_admin) {
        const result = yield prisma_1.default.reviewAndRating.findMany({});
        return result;
    }
    const result = yield prisma_1.default.reviewAndRating.findMany({
        where: {
            userId
        }
    });
    return result;
});
const getAllReviewRatingsForSingleService = (serviceId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.reviewAndRating.findMany({
        where: {
            serviceId,
        },
    });
    return result;
});
exports.ServicesProvidedService = {
    createService,
    getAllServices,
    getAllServicesByCategory,
    getSingleService,
    updateService,
    deleteService,
    giveReviewRating,
    getAllReviewRatings,
    getAllReviewRatingsForSingleService,
};
