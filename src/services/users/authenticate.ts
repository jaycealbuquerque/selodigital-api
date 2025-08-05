import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import 'dotenv/config'
import { AppError } from '../../erros/AppError'
import dayjs from 'dayjs'
import { prisma } from '../../lib/prisma'

export class AuthenticateService {
  async execute({ email, password }) {
    const user = await prisma.usuario.findUnique({
      where: { email },
    })

    if (!user) {
      throw new AppError('Invalid Credentials')
    }

    const doestPasswordMatches = await compare(password, user.password_hash)

    if (!doestPasswordMatches) {
      throw new AppError('Invalid Credentials')
    }

    const token = sign({}, process.env.JWT_SECRET, {
      subject: String(user.id),
      expiresIn: process.env.EXPIRES_IN_TOKEN,
    })

    const tokenReturn = {
      token,
      user: {
        name: user.nome,
        email: user.email,
      },
    }
    return tokenReturn
  }
}
