import { AppError } from '../../erros/AppError'
import { prisma } from '../../lib/prisma'

export class GetOneAutService {
  async execute(idAto: number) {
    if (!idAto) {
      throw new AppError('ID do ato é obrigatório.', 400)
    }

    const ato = await prisma.ato.findUnique({
      where: {
        idAto: Number(idAto),
      },
      include: {
        solicitante: true,
        descricaoDoc: true,
        atendimento: true,
      },
    })

    if (!ato) {
      throw new AppError('Ato não encontrado.', 404)
    }

    return ato
  }
}
