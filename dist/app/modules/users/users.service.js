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
exports.UserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const client_1 = require("@prisma/client");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.password = yield bcrypt_1.default.hash(payload.password, Number(config_1.default.bcrypt_salt_rounds));
    const data = Object.assign(Object.assign({}, payload), { role: client_1.UserRole.user });
    const result = yield prisma_1.default.user.create({
        data,
    });
    // eslint-disable-next-line no-unused-vars
    const { password } = result, others = __rest(result, ["password"]);
    return others;
});
const userLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email: userEmail, password } = payload;
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            email: userEmail,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User does not exist');
    }
    if (isUserExist.email) {
        const isPasswordMatched = yield bcrypt_1.default.compare(password, isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.password);
        if (!isPasswordMatched) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Password is incorrect');
        }
    }
    const { id, email, role } = isUserExist;
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role, email }, config_1.default.jwt.jwt_secret, config_1.default.jwt.jwt_expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ userId: id, role, email }, config_1.default.jwt.jwt_refresh_secret, config_1.default.jwt.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        email,
        id,
    };
});
const userRefreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.jwt_refresh_secret);
    }
    catch (err) {
        throw new ApiError_1.default(403, 'Invalid refresh token');
    }
    const { id } = verifiedToken;
    const isUserExist = yield prisma_1.default.user.findUnique({ where: { id } });
    if (!isUserExist) {
        throw new ApiError_1.default(404, 'User does not exist');
    }
    const { id: userId, role, email } = isUserExist;
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({ userId, role, email }, config_1.default.jwt.jwt_secret, config_1.default.jwt.jwt_expires_in);
    return {
        accessToken: newAccessToken,
    };
});
const getAllUsers = (userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const { role } = userInfo;
    if (role === client_1.UserRole.admin) {
        const result = yield prisma_1.default.user.findMany({
            where: {
                NOT: {
                    role: client_1.UserRole.super_admin
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                contactNo: true,
                address: true,
                district: true,
            },
        });
        return result;
    }
    const result = yield prisma_1.default.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            contactNo: true,
            address: true,
            district: true,
        },
    });
    return result;
});
const getUser = (id, userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    if (role === client_1.UserRole.user) {
        if (id !== userId) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You are not authorized!");
        }
    }
    const result = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            contactNo: true,
            address: true,
            district: true
        },
    });
    if (role === client_1.UserRole.admin) {
        if ((result === null || result === void 0 ? void 0 : result.role) === client_1.UserRole.super_admin) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You are not authorized!");
        }
    }
    return result;
});
const updateUser = (id, userId, role, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.user.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User didn't found!");
    }
    if (role === client_1.UserRole.user) {
        if (userId !== id) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Not Authorized");
        }
    }
    if (role === client_1.UserRole.admin) {
        if (isExist.role === client_1.UserRole.super_admin) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Not Authorized");
        }
    }
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: payload,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            contactNo: true,
            address: true,
            district: true
        },
    });
    return result;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.delete({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            contactNo: true,
            address: true,
            district: true
        },
    });
    return result;
});
const getProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User does not exist!');
    }
    return result;
});
exports.UserService = {
    createUser,
    userLogin,
    userRefreshToken,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    getProfile,
};
