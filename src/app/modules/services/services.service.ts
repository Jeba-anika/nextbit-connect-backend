import { Prisma, ReviewAndRating, Service, UserRole } from '@prisma/client'
import prisma from '../../../shared/prisma'
import { IpaginationOptions } from '../../../interfaces/pagination'
import { paginationHelpers } from '../../../helpers/paginationHelper'
import { IServiceFilterRequest } from './services.interface'
import { serviceSearchableFields } from './services.constants'

const createService = async (data: Service): Promise<Service> => {
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
  const { search, minPrice, maxPrice, category, location, ...filtersData } =
    filters
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
const giveReviewRating = async (payload: ReviewAndRating) => {
  let result = {} as ReviewAndRating
  await prisma.$transaction(async transactionClient => {
    result = await transactionClient.reviewAndRating.create({
      data: payload,
      include: {
        service: true,
      },
    })
    const avgRating = await transactionClient.reviewAndRating.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        serviceId: result?.serviceId,
      },
    })
    const updatedData = await transactionClient.service.update({
      where: {
        id: result?.serviceId,
      },
      data: {
        rating: Number(avgRating._avg.rating?.toFixed(2)),
      },
    })
    console.log(updatedData, result)
    return result
  })
  return result
}

const getAllReviewRatings = async (role: string, userId: string) => {
  if (role === UserRole.admin || role === UserRole.super_admin) {
    const result = await prisma.reviewAndRating.findMany({})
    return result
  }
  const result = await prisma.reviewAndRating.findMany({
    where: {
      userId
    }
  })
  return result
}
const getAllReviewRatingsForSingleService = async (serviceId: string) => {
  const result = await prisma.reviewAndRating.findMany({
    where: {
      serviceId,
    },
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
  giveReviewRating,
  getAllReviewRatings,
  getAllReviewRatingsForSingleService,
  
}
