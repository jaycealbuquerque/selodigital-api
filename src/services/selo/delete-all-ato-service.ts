// src/services/ato/delete-all-by-atendimento-service.ts
import { AppError } from '../../erros/AppError'
import { prisma } from '../../lib/prisma'

interface DeleteAllAtosByAtendimentoInput {
  numeroAtendimento: string // será convertido para BigInt
}

export class DeleteAllAtosByAtendimentoService {
  async execute({ numeroAtendimento }: DeleteAllAtosByAtendimentoInput) {
    if (!numeroAtendimento) {
      throw new AppError('Número de atendimento é obrigatório.', 400)
    }

    const atendimento = await prisma.atendimento.findUnique({
      where: { numeroAtendimento: BigInt(numeroAtendimento) },
      select: { id: true, numeroAtendimento: true },
    })
    if (!atendimento) {
      throw new AppError('Atendimento não encontrado.', 404)
    }

    const atos = await prisma.ato.findMany({
      where: { atendimentoId: atendimento.id },
      select: {
        idAto: true,
        statusAto: true,
        seloId: true,
      },
      orderBy: { idAto: 'asc' },
    })

    if (atos.length === 0) {
      return {
        message: 'Nenhum ato encontrado para este atendimento.',
        numeroAtendimento: atendimento.numeroAtendimento,
        totalAtos: 0,
        excluidos: [],
        ignorados: [],
      }
    }

    const ignorados = atos.filter((a) => a.statusAto).map((a) => a.idAto)
    const elegiveis = atos.filter((a) => !a.statusAto)

    await prisma.$transaction(
      async (trx) => {
        for (const ato of elegiveis) {
          if (ato.seloId) {
            // devolve selo ao estoque
            await trx.selo.update({
              where: { id: ato.seloId },
              data: { status: 0 },
            })
            // desvincula selo do ato (por segurança)
            await trx.ato.update({
              where: { idAto: ato.idAto },
              data: { seloId: null },
            })
          }

          // exclui o ato
          await trx.ato.delete({
            where: { idAto: ato.idAto },
          })
        }
      },
      { isolationLevel: 'Serializable' },
    )

    return {
      message: 'Processo concluído.',
      numeroAtendimento: atendimento.numeroAtendimento,
      totalAtos: atos.length,
      excluidos: elegiveis.map((a) => a.idAto),
      ignorados, // enviados ao TJCE (statusAto = true)
    }
  }
}
