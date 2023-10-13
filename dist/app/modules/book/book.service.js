"use strict";
// import { SortOrder } from 'mongoose'
// import { paginationHelpers } from '../../../helpers/paginationHelpers'
// import { IpaginationOptions } from '../../../interfaces/pagination'
// import { bookSearchableFields } from './book.constants'
// import { IBook, IBookFilters } from './book.interface'
// import { Book } from './book.model'
// import { IGenericResponse } from '../../../interfaces/common'
// import ApiError from '../../../errors/ApiError'
// import { JwtPayload } from 'jsonwebtoken'
// import { User } from '../users/users.model'
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
exports.BookService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const book_constants_1 = require("./book.constants");
const createBook = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.create({
        data,
        include: {
            category: true,
        },
    });
    return result;
});
const getAllBooks = (options, filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, skip, size, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { search, minPrice, maxPrice, category } = filters, filtersData = __rest(filters, ["search", "minPrice", "maxPrice", "category"]);
    const andConditions = [];
    if (search) {
        andConditions.push({
            OR: book_constants_1.bookSearchableFields.map(field => ({
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
    const result = yield prisma_1.default.book.findMany({
        where: whereCondition,
        take: size,
        skip,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = yield prisma_1.default.book.count();
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
const getAllBooksByCategory = (categoryId, options, filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, skip, size, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { search, minPrice, maxPrice, category } = filters, filtersData = __rest(filters, ["search", "minPrice", "maxPrice", "category"]);
    const andConditions = [];
    andConditions.push({
        categoryId,
    });
    if (search) {
        andConditions.push({
            OR: book_constants_1.bookSearchableFields.map(field => ({
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
    const result = yield prisma_1.default.book.findMany({
        where: whereCondition,
        take: size,
        skip,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = yield prisma_1.default.book.count();
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
const getSingleBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.findUnique({ where: { id } });
    return result;
});
const updateBook = (id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.update({
        where: {
            id,
        },
        data: updatedData,
    });
    return result;
});
const deleteBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.delete({
        where: { id },
    });
    return result;
});
exports.BookService = {
    createBook,
    getAllBooks,
    getAllBooksByCategory,
    getSingleBook,
    updateBook,
    deleteBook,
};
