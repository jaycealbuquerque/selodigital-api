import { AppError } from '../../erros/AppError'
import { prisma } from '../../lib/prisma'

interface DeleteOneAtoInput {
  idAto: number
}

export class DeleteOneAtoService {
  async execute({ idAto }: DeleteOneAtoInput) {
    if (!idAto) {
      throw new AppError('ID do ato é obrigatório.', 400)
    }

    // 1) Buscar o ato
    const ato = await prisma.ato.findUnique({
      where: { idAto },
      select: {
        idAto: true,
        statusAto: true,
        seloId: true,
      },
    })
    if (!ato) throw new AppError('Ato não encontrado.', 404)

    // 2) Bloquear exclusão se já foi enviado ao TJCE
    if (ato.statusAto) {
      throw new AppError(
        'Este ato já foi enviado ao TJCE e não pode ser excluído.',
        409,
      )
    }

    // 3) Transação: devolver selo (se houver) e excluir ato
    await prisma.$transaction(
      async (trx) => {
        if (ato.seloId) {
          // Devolve o selo ao estoque
          await trx.selo.update({
            where: { id: ato.seloId },
            data: { status: 0 },
          })

          // Desvincula o selo do ato
          await trx.ato.update({
            where: { idAto: ato.idAto },
            data: { seloId: null },
          })
        }

        // Exclui o ato
        await trx.ato.delete({
          where: { idAto: ato.idAto },
        })
      },
      { isolationLevel: 'Serializable' },
    )

    return {
      message: 'Ato excluído com sucesso.',
      idAto: ato.idAto,
      seloDevolvido: Boolean(ato.seloId),
    }
  }
}
