import { PrismaClient } from '@prisma/client'
import { RegisterService } from '../src/services/users/register'

const prisma = new PrismaClient()

async function main() {
  const registerUseCase = new RegisterService()

  const usersData = [
    {
      nome: 'Jayce Albuquerque',
      email: 'jayce@jayce.com',
      cpf: '00000000000',
      cargo: 'Escrevente',
      password: '123456',
    },
    // {
    //   nome: 'Livia Loiola',
    //   email: 'livia@livia.com',
    //   cpf: '12345678900',
    //   cargo: 'Escrevente',
    //   password: '123456',
    // },
    // {
    //   nome: 'João Silva',
    //   email: 'joao@joao.com',
    //   cpf: '98765432100',
    //   cargo: 'Tabelião',
    //   password: '123456',
    // },
  ]

  for (const user of usersData) {
    await registerUseCase.execute(user)
  }

  console.log('Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('Erro ao rodar o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
