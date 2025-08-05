import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import 'dotenv/config'
import { AppError } from '../erros/AppError'

interface IPayloud {
  sub: string
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError('Token mising!', 401)
  }

  const [, token] = authHeader.split(' ')

  try {
    const { sub } = verify(token, process.env.JWT_SECRET) as IPayloud

    // console.log(sub)
    next()
  } catch {
    throw new AppError('Invalid token!', 401)
  }
}
