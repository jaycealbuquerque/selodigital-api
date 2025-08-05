// import { env } from '../env'
import { PrismaClient } from '@prisma/client'

import 'dotenv/config'
import { AppError } from '../erros/AppError'

const ENV = process.env.NODE_ENV
export const prisma = new PrismaClient({
  log: ENV === 'dev' ? ['query', 'info', 'warn', 'error'] : [],
})

// Intercepta erros do Prisma automaticamente
prisma.$use(async (params, next) => {
  try {
    // Executa a operação do Prisma normalmente
    return await next(params)
  } catch (error) {
    // Captura e trata erros do Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Erro do Prisma:', error.message)

      // Retorna uma mensagem amigável para o cliente
      throw new AppError(
        'Erro ao salvar no banco de dados. Tente novamente.',
        500,
      )
    }

    // Relança qualquer erro inesperado
    throw new AppError(`Erro inesperado com prisma: ${error.message}`, 500)
  }
})
