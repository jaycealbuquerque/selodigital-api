import { AppError } from '../../erros/AppError'
import { prisma } from '../../lib/prisma'

export class ListAllAutService {
  async execute(numeroAtendimento: string) {
    const atendimento = await prisma.atendimento.findUnique({
      where: {
        numeroAtendimento: BigInt(numeroAtendimento),
      },
    })

    if (!atendimento) {
      throw new AppError('Atendimento não encontrado.', 404)
    }

    const atos = await prisma.ato.findMany({
      where: {
        atendimentoId: atendimento.id,
      },
      include: {
        solicitante: true,
        descricaoDoc: true,
        selo: true, // caso você queira incluir selo se já estiver associado
      },
      orderBy: {
        idAto: 'asc',
      },
    })

    return atos
  }
}
