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

import { Book, Prisma } from '@prisma/client'
import prisma from '../../../shared/prisma'
import { IpaginationOptions } from '../../../interfaces/pagination'
import { paginationHelpers } from '../../../helpers/paginationHelper'
import { IBookFilterRequest } from './book.interface'
import { bookSearchableFields } from './book.constants'

const createBook = async (
  data: Book
 
): Promise<Book> => {
  const result = await prisma.book.create({
    data,
    include: {
      category: true,
    },
  })
  return result
}
const getAllBooks = async (
  options: IpaginationOptions,
  filters: IBookFilterRequest
) => {
  const { page, skip, size, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options)
  const { search, minPrice, maxPrice, category, ...filtersData } = filters
  const andConditions = []

  if (search) {
    andConditions.push({
      OR: bookSearchableFields.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      })),
    })
  }

  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtersData).map(key => ({
        [key]: (filtersData as any)[key],
      })),
    })
  }
  if (minPrice) {
    andConditions.push({
      price: {
        gte: Number(minPrice),
      },
    })
  }
  if (maxPrice) {
    andConditions.push({
      price: {
        lte: Number(maxPrice),
      },
    })
  }
  if (category) {
    andConditions.push({
      categoryId: category,
    })
  }

  const whereCondition: Prisma.BookWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {}

  const result = await prisma.book.findMany({
    where: whereCondition,
    take: size,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
  })
  const total = await prisma.book.count()
  return {
    meta: {
      page,
      size,
      total,
      totalPage: Math.ceil(total / size),
    },
    data: result,
  }
}

const getAllBooksByCategory = async (
  categoryId: string,
  options: IpaginationOptions,
  filters: IBookFilterRequest
) => {
  const { page, skip, size, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options)
  const { search, minPrice, maxPrice, category, ...filtersData } = filters
  const andConditions = []
  andConditions.push({
    categoryId,
  })

  if (search) {
    andConditions.push({
      OR: bookSearchableFields.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      })),
    })
  }

  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtersData).map(key => ({
        [key]: (filtersData as any)[key],
      })),
    })
  }
  if (minPrice) {
    andConditions.push({
      price: {
        gte: Number(minPrice),
      },
    })
  }
  if (maxPrice) {
    andConditions.push({
      price: {
        lte: Number(maxPrice),
      },
    })
  }
  if (category) {
    andConditions.push({
      categoryId: category,
    })
  }

  const whereCondition: Prisma.BookWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {}

  const result = await prisma.book.findMany({
    where: whereCondition,
    take: size,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
  })
  const total = await prisma.book.count()
  return {
    meta: {
      page,
      size,
      total,
      totalPage: Math.ceil(total / size),
    },
    data: result,
  }
}

const getSingleBook = async (id: string): Promise<Book | null> => {
  const result = await prisma.book.findUnique({ where: { id } })
  return result
}

const updateBook = async (
  id: string,
  updatedData: Partial<Book>
): Promise<Book | null> => {
  const result = await prisma.book.update({
    where: {
      id,
    },
    data: updatedData,
  })
  return result
}

const deleteBook = async (id: string) => {
  const result = await prisma.book.delete({
    where: { id },
  })
  return result
}

export const BookService = {
  createBook,
  getAllBooks,
  getAllBooksByCategory,
  getSingleBook,
  updateBook,
  deleteBook,
}
