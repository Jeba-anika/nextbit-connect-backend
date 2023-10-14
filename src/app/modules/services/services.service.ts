import {  Prisma, Service } from '@prisma/client'
import prisma from '../../../shared/prisma'
import { IpaginationOptions } from '../../../interfaces/pagination'
import { paginationHelpers } from '../../../helpers/paginationHelper'
import { IServiceFilterRequest } from './services.interface'
import {  serviceSearchableFields } from './services.constants'

const createService= async (
  data: Service
): Promise<Service> => {
  const result = await prisma.service.create({
    data,
    include: {
      category: true,
    },
  })
  return result
}
const getAllServices = async (
  options: IpaginationOptions,
  filters: IServiceFilterRequest
) => {
  const { page, skip, size, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options)
  const { search, minPrice, maxPrice, category,location, ...filtersData } = filters
  const andConditions = []

  if (search) {
    andConditions.push({
      OR: serviceSearchableFields.map(field => ({
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
  if (location) {
    andConditions.push({
      location: location,
    })
  }

  const whereCondition: Prisma.ServiceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {}

  const result = await prisma.service.findMany({
    where: whereCondition,
    take: size,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
  })
  const total = await prisma.service.count()
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

const getAllServicesByCategory = async (
  categoryId: string,
  options: IpaginationOptions,
  filters: IServiceFilterRequest
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
      OR: serviceSearchableFields.map(field => ({
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

  const whereCondition: Prisma.ServiceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {}

  const result = await prisma.service.findMany({
    where: whereCondition,
    take: size,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
  })
  const total = await prisma.service.count()
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

const getSingleService = async (id: string): Promise<Service | null> => {
  const result = await prisma.service.findUnique({ where: { id } })
  return result
}

const updateService = async (
  id: string,
  updatedData: Partial<Service>
): Promise<Service | null> => {
  const result = await prisma.service.update({
    where: {
      id,
    },
    data: updatedData,
  })
  return result
}

const deleteService = async (id: string) => {
  const result = await prisma.service.delete({
    where: { id },
  })
  return result
}

export const ServicesProvidedService = {
  createService,
  getAllServices,
  getAllServicesByCategory,
  getSingleService,
  updateService,
  deleteService,
}
