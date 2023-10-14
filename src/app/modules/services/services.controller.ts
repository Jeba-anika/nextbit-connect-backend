import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
// import { IBook } from './book.interface'
import {  ServicesProvidedService } from './services.service'
import {  Service } from '@prisma/client'
import httpStatus from 'http-status'
import pick from '../../../shared/pick'
import {  serviceFilterableFields } from './services.constants'
// import pick from '../../../shared/pick'
// import { bookFilterableFields } from './book.constants'
// import { paginationFields } from '../../../constants/pagination'

const createService = catchAsync(async (req: Request, res: Response) => {
  //   const userInfo = req.user
  const { ...serviceData } = req.body
  const result = await ServicesProvidedService.createService(serviceData)
  sendResponse<Service>(res, {
    success: true,
    message: 'Service created successfully',
    statusCode: 200,
    data: result,
  })
})

const getAllServices = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
  const filters = pick(req.query, serviceFilterableFields)
  const result = await ServicesProvidedService.getAllServices(options, filters)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Services fetched  successfully',
    data: result,
  })
})

const getAllServicesByCategory = catchAsync(
  async (req: Request, res: Response) => {
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
    const filters = pick(req.query, serviceFilterableFields)
    const result = await ServicesProvidedService.getAllServicesByCategory(
      req.params.categoryId,
      options,
      filters
    )
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Services with associated category data fetched successfully',
      data: result,
    })
  }
)

const getSingleService= catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await ServicesProvidedService.getSingleService(id)
  sendResponse<Service>(res, {
    statusCode: 200,
    success: true,
    message: 'Service fetched successfully',
    data: result,
  })
})

const updateService = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const updatedService = req.body
  const result = await ServicesProvidedService.updateService(id, updatedService)
  sendResponse<Service>(res, {
    statusCode: 200,
    success: true,
    message: 'Service edited successfully',
    data: result,
  })
})

const deleteService = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await ServicesProvidedService.deleteService(id)
  sendResponse<Service>(res, {
    statusCode: 200,
    success: true,
    message: 'Service deleted successfully',
    data: result,
  })
})

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

export const ServiceController = {
  createService,
  getAllServices,
  getAllServicesByCategory,
  getSingleService,
  updateService,
  deleteService,
  //   addToWishlist,
  //   addToCurrentlyReading,
  //   addToPlanToReadSoon,
  //   setFinishedReading,
  //   addReview,
}
