import prisma from '../../../shared/prisma'
import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'
import { Order, UserRole } from '@prisma/client';


const createOrder = async (
  payload: Order,
  userId: string
) => {
  const result = await prisma.order.create({
    data: {
      ...payload,
      userId
    }
  })
  return result
}

const getAllOrders = async (userId: string, role: string): Promise<Order[]> => {
  let result: Order[] = []
  if (role === UserRole.admin || role === UserRole.super_admin) {
    result = await prisma.order.findMany({
      include:{
        user: true,
        service: true
      }
    })
  } else if (role === UserRole.user) {
    result = await prisma.order.findMany({
      where: {
        userId,
      },
      include:{
        user: true,
        service: true
      }
    })
  }
  return result
}

const getSingleOrder = async (
  orderId: string,
  userId: string,
  role: string
): Promise<Order | null> => {
  const result = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include:{
      user: true,
      service: true
    }
  })
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Order does not exist!')
  }
  if (role === UserRole.user) {
    if (result?.userId !== userId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unauthorized access')
    }
  }
  return result
}

export const OrdersService = {
  createOrder,
  getAllOrders,
  getSingleOrder,
}
