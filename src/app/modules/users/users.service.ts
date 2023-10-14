import httpStatus from 'http-status'
import config from '../../../config'
import ApiError from '../../../errors/ApiError'
import {
  IGenericLoginInfo,
  IGenericLoginResponse,
} from '../../../interfaces/common'
import prisma from '../../../shared/prisma'
import { User, UserRole } from '@prisma/client'
import { jwtHelpers } from '../../../helpers/jwtHelpers'
import { JwtPayload, Secret } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { IUserToken } from './users.interface'

const createUser = async (payload: User): Promise<Partial<User>> => {
  payload.password = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  )
  const data = {
    ...payload,
    role: UserRole.user,
  }

  const result = await prisma.user.create({
    data,
  })
  // eslint-disable-next-line no-unused-vars
  const { password, ...others } = result
  return others
}

const userLogin = async (payload: IGenericLoginInfo) => {
  const { email: userEmail, password } = payload
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  })

  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist')
  }

  if (isUserExist.email) {
    const isPasswordMatched = await bcrypt.compare(
      password,
      isUserExist?.password
    )
    if (!isPasswordMatched) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Password is incorrect')
    }
  }

  const { id, email, role } = isUserExist

  const accessToken = jwtHelpers.createToken(
    { userId: id, role, email },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expires_in as string
  )

  const refreshToken = jwtHelpers.createToken(
    { userId: id, role, email },
    config.jwt.jwt_refresh_secret as Secret,
    config.jwt.jwt_refresh_expires_in as string
  )
  return {
    accessToken,
    refreshToken,
    email,
    id,
  }
}

const userRefreshToken = async (
  token: string
): Promise<Partial<IGenericLoginResponse>> => {
  let verifiedToken = null
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.jwt_refresh_secret as Secret
    )
  } catch (err) {
    throw new ApiError(403, 'Invalid refresh token')
  }

  const { id } = verifiedToken
  const isUserExist = await prisma.user.findUnique({ where: { id } })
  if (!isUserExist) {
    throw new ApiError(404, 'User does not exist')
  }

  const { id: userId, role, email } = isUserExist
  const newAccessToken = jwtHelpers.createToken(
    { userId, role, email },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expires_in as string
  )
  return {
    accessToken: newAccessToken,
  }
}

const getAllUsers = async (userInfo: JwtPayload | null ): Promise<Partial<User>[]> => {
  const { role } = userInfo as IUserToken
  if (role === UserRole.admin) {
    const result = await prisma.user.findMany({
      where:{
        NOT: {
          role: UserRole.super_admin
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        contactNo: true,
        address: true,
        district: true,
      },
    })
    return result
  }
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      contactNo: true,
      address: true,
      district: true,
    },
  })
  return result

  
}

const getUser = async (id: string, userId: string, role: string): Promise<Partial<User> | null> => {
  if(role === UserRole.user){
    if(id !== userId){
      throw new ApiError(httpStatus.BAD_REQUEST, "You are not authorized!")
    }
  }
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      contactNo: true,
      address: true,
      district: true
    },
  })
  if(role === UserRole.admin){
    if(result?.role === UserRole.super_admin){
      throw new ApiError(httpStatus.BAD_REQUEST, "You are not authorized!")
    }
  }
  return result
}

const updateUser = async (
  id: string,
  userId: string,
  role: string,
  payload: Partial<User>
): Promise<Partial<User>> => {
  const isExist = await prisma.user.findUnique({
    where: { id },
  })
  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User didn't found!")
  }
  if(role === UserRole.user){
    if(userId !== id){
      throw new ApiError(httpStatus.BAD_REQUEST, "Not Authorized")
    }
  }
  if(role === UserRole.admin){
    if(isExist.role === UserRole.super_admin){
      throw new ApiError(httpStatus.BAD_REQUEST, "Not Authorized")
    }
  }
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      contactNo: true,
      address: true,
      district: true
    },
  })
  return result
}

const deleteUser = async (id: string) => {
  const result = await prisma.user.delete({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      contactNo: true,
      address: true,
      district: true
    },
  })
  return result
}

const getProfile = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist!')
  }
  return result
}

export const UserService = {
  createUser,
  userLogin,
  userRefreshToken,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getProfile,
}
