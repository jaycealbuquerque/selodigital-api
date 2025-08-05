import { hash } from 'bcryptjs'
import { prisma } from '../../lib/prisma'
import { AppError } from '../../erros/AppError'

interface RegisterDTO {
  nome: string
  email: string
  cpf: string
  cargo: string
  password: string
}

export class RegisterService {
  async execute({ nome, email, cpf, cargo, password }: RegisterDTO) {
    const hasEmail = await prisma.usuario.findUnique({
      where: { email },
    })
    if (hasEmail) {
      throw new AppError('Email already exists', 400)
    }

    const hashedPassword = await hash(password, 8)

    const user = await prisma.usuario.create({
      data: { nome, email, cpf, cargo, password_hash: hashedPassword },
    })

    return user
  }
}
