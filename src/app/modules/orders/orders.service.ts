import { Order } from '@prisma/client'
import prisma from '../../../shared/prisma'
import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'

const createOrder = async (
  payload: { bookId: string; quantity: number }[],
  userId: string
) => {
  const result = await prisma.order.create({
    data: {
      userId,
      orderedBooks: payload,
    },
  })
  return result
}

const getAllOrders = async (userId: string, role: string): Promise<Order[]> => {
  let result: Order[] = []
  if (role === 'admin') {
    result = await prisma.order.findMany({})
  } else if (role === 'customer') {
    result = await prisma.order.findMany({
      where: {
        userId,
      },
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
  })
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Order does not exist!')
  }
  if (role === 'customer') {
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
