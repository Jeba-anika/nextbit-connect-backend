import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { UserService } from './users.service'
import { User } from '@prisma/client'
import config from '../../../config'
import { IGenericLoginResponse } from '../../../interfaces/common'
import httpStatus from 'http-status'
import { IUserToken } from './users.interface'

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUser(req.body)
  sendResponse<Partial<User>>(res, {
    statusCode: 200,
    success: true,
    message: 'User created successfully',
    data: result,
  })
})

const userLogin = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body
  const result = await UserService.userLogin(loginData)
  const { refreshToken,accessToken,email,id } = result
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  }
  res.cookie('refreshToken', refreshToken, cookieOptions)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User signin successfully!',
    data: {accessToken,email,id},
  })
})

const userRefreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies
  const result = await UserService.userRefreshToken(refreshToken)
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  }
  res.cookie('refreshToken', refreshToken, cookieOptions)
  sendResponse<Partial<IGenericLoginResponse>>(res, {
    statusCode: 200,
    success: true,
    message: 'User Logged In successfully',
    data: result,
  })
})

const getAllUsers = catchAsync(
  async(req:Request, res:Response)=>{
    const result = await UserService.getAllUsers(req.user)
    sendResponse<Partial<User>[]>(res,{
      statusCode: httpStatus.OK,
      success: true,
      message: 'All users retrieved',
      data: result
    })
  }
)

const getUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const {userId, role} = req.user as IUserToken
  const result = await UserService.getUser(id, userId,role)

  sendResponse<Partial<User>>(res, {
    statusCode: 200,
    success: true,
    message: 'User fetched successfully !',
    data: result,
  })
})

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const {userId, role} = req.user as IUserToken
  const result = await UserService.updateUser(id,userId,role, req.body)

  sendResponse<Partial<User>>(res, {
    statusCode: 200,
    success: true,
    message: 'User updated successfully !',
    data: result,
  })
})


const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await UserService.deleteUser(id)

  sendResponse<Partial<User>>(res, {
    statusCode: 200,
    success: true,
    message: 'User deleted successfully !',
    data: result,
  })
})

const getProfile = catchAsync(
  async(req: Request, res:Response)=>{
    const result = await UserService.getProfile(req.user?.userId)
    sendResponse(res,{
      statusCode: httpStatus.OK,
      success:true,
      message: 'User profile fetched successfully',
      data: result
    })
  }
)

export const UserController = {
  createUser,
   userLogin,
   userRefreshToken,
   getAllUsers,
   getUser,
   updateUser,
   deleteUser,
   getProfile
}
