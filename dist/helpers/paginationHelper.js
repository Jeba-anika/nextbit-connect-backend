"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationHelpers = void 0;
const calculatePagination = (options) => {
    const page = Number(options.page || 1);
    const limit = Number(options.size || 10);
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy || 'id';
    const sortOrder = options.sortOrder || 'desc';
    return {
        page,
        size: limit,
        skip,
        sortBy,
        sortOrder,
    };
};
exports.paginationHelpers = {
    calculatePagination,
};
