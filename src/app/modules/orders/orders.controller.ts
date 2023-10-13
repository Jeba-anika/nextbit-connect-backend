import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { OrdersService } from "./orders.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const createOrder= catchAsync(
    async(req: Request, res: Response)=>{
        const userId = req.user?.userId
        const result = await OrdersService.createOrder(req.body?.orderedBooks, userId)
        sendResponse(res,{
            statusCode: httpStatus.OK,
            success:true,
            message: 'Order created successfully!',
            data:result
        })
    }
)

const getAllOrders = catchAsync(
    async(req: Request, res: Response)=>{
        const result = await OrdersService.getAllOrders(req.user?.userId, req.user?.role)
        sendResponse(res,{
            statusCode: httpStatus.OK,
            success:true,
            message: 'Orders fetched successfully!',
            data: result
        })
    }
)
const getSingleOrder = catchAsync(
    async(req: Request, res: Response)=>{
        const result = await OrdersService.getSingleOrder(req.params.orderId,req.user?.userId, req.user?.role)
        sendResponse(res,{
            statusCode: httpStatus.OK,
            success:true,
            message: 'Order fetched successfully!',
            data: result
        })
    }
)


export const OrdersController = {
    createOrder,
    getAllOrders,
    getSingleOrder
}