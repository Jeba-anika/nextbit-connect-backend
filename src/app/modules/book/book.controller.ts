import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
// import { IBook } from './book.interface'
import { BookService } from './book.service'
import { Book } from '@prisma/client'
import httpStatus from 'http-status'
import pick from '../../../shared/pick'
import { bookFilterableFields } from './book.constants'
// import pick from '../../../shared/pick'
// import { bookFilterableFields } from './book.constants'
// import { paginationFields } from '../../../constants/pagination'

const createBook = catchAsync(async (req: Request, res: Response) => {
  //   const userInfo = req.user
  const { ...bookData } = req.body
  const result = await BookService.createBook(bookData)
  sendResponse<Book>(res, {
    success: true,
    message: 'Book created successfully',
    statusCode: 200,
    data: result,
  })
})

const getAllBooks = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
  const filters = pick(req.query, bookFilterableFields)
  const result = await BookService.getAllBooks(options, filters)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Books fetched  successfully',
    data: result,
  })
})

const getAllBooksByCategory = catchAsync(
  async (req: Request, res: Response) => {
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])
    const filters = pick(req.query, bookFilterableFields)
    const result = await BookService.getAllBooksByCategory(
      req.params.categoryId,
      options,
      filters
    )
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Books with associated category data fetched successfully',
      data: result,
    })
  }
)

const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await BookService.getSingleBook(id)
  sendResponse<Book>(res, {
    statusCode: 200,
    success: true,
    message: 'Book fetched successfully',
    data: result,
  })
})

const updateBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id

  const updatedBook = req.body
  const result = await BookService.updateBook(id, updatedBook)
  sendResponse<Book>(res, {
    statusCode: 200,
    success: true,
    message: 'Book edited successfully',
    data: result,
  })
})

const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await BookService.deleteBook(id)
  sendResponse<Book>(res, {
    statusCode: 200,
    success: true,
    message: 'Book deleted successfully',
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

export const BookController = {
  createBook,
  getAllBooks,
  getAllBooksByCategory,
  getSingleBook,
  updateBook,
  deleteBook,
  //   addToWishlist,
  //   addToCurrentlyReading,
  //   addToPlanToReadSoon,
  //   setFinishedReading,
  //   addReview,
}
