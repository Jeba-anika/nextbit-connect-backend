import httpStatus from 'http-status'
import config from '../../../config'
import ApiError from '../../../errors/ApiError'
import {
  IGenericLoginInfo,
  IGenericLoginResponse,
} from '../../../interfaces/common'
import prisma from '../../../shared/prisma'
import { User } from '@prisma/client'
import { jwtHelpers } from '../../../helpers/jwtHelpers'
import { Secret } from 'jsonwebtoken'

const createUser = async (payload: User): Promise<Partial<User>> => {
  // payload.password = await bcrypt.hash(
  //   payload.password,
  //   Number(config.bcrypt_salt_rounds)
  // )
  const result = await prisma.user.create({
    data: payload,
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
    if (isUserExist.password !== password) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Password is incorrect')
    }
  }

  const { id, email, role } = isUserExist

  const iat = Math.floor(Date.now() / 1000)
  const accessToken = jwtHelpers.createToken(
    { userId: id, role, iat },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expires_in as string
  )

  const refreshToken = jwtHelpers.createToken(
    { userId: id, role, iat },
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

  const { id: userId, role } = isUserExist
  const newAccessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expires_in as string
  )
  return {
    accessToken: newAccessToken,
  }
}

const getAllUsers = async (): Promise<Partial<User>[]> => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      contactNo: true,
      address: true,
      profileImg: true,
    },
  })
  return result
}

const getUser = async (id: string): Promise<Partial<User> | null> => {
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
      profileImg: true,
    },
  })
  return result
}

const updateUser = async (
  id: string,
  payload: Partial<User>
): Promise<Partial<User>> => {
  const isExist = await prisma.user.findUnique({
    where: { id },
  })
  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User didn't found!")
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
      profileImg: true,
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
      profileImg: true,
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
  getProfile
}
