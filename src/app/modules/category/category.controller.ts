import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { CategoryService } from "./ccategory.services";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { Category } from "@prisma/client";

const createCategory = catchAsync(
    async(req: Request, res: Response)=>{
        const result = await CategoryService.createCategory(req.body)
        sendResponse(res,{
            statusCode: httpStatus.OK,
            success: true,
            message: 'Category is created successfully!',
            data: result
        })
    }
)
const getAllCategories = catchAsync(
    async(req: Request, res: Response)=>{
        const result = await CategoryService.getAllCategories()
        sendResponse<Category[]>(res,{
            statusCode: httpStatus.OK,
            success: true,
            message: 'Categories fetched successfully!',
            data: result
        })
    }
)
const getSingleCategory = catchAsync(
    async(req: Request, res: Response)=>{
        const result = await CategoryService.getSingleCategory(req.params.id)
        sendResponse<Category>(res,{
            statusCode: httpStatus.OK,
            success: true,
            message: 'Category fetched successfully!',
            data: result
        })
    }
)

const updateCategory = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id
  
    const result = await CategoryService.updateCategory(id, req.body)
  
    sendResponse<Partial<Category>>(res, {
      statusCode: 200,
      success: true,
      message: 'Category updated successfully !',
      data: result,
    })
  })
  
  
  const deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id
  
    const result = await CategoryService.deleteCategory(id)
  
    sendResponse<Partial<Category>>(res, {
      statusCode: 200,
      success: true,
      message: 'Category deleted successfully !',
      data: result,
    })
  })
  

export const CategoryController={
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory
}