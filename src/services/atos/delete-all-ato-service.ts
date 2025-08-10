// src/services/atendimento/delete-atendimento-service.ts
import { AppError } from '../../erros/AppError'
import { prisma } from '../../lib/prisma'

interface DeleteAtendimentoInput {
  numeroAtendimento: string // recebido como string; convertido para BigInt
}

export class DeleteAllAtosByAtendimentoService {
  async execute({ numeroAtendimento }: DeleteAtendimentoInput) {
    if (!numeroAtendimento) {
      throw new AppError('Número de atendimento é obrigatório.', 400)
    }

    // 1) Localiza atendimento
    const atendimento = await prisma.atendimento.findUnique({
      where: { numeroAtendimento: BigInt(numeroAtendimento) },
      select: { id: true, numeroAtendimento: true },
    })
    if (!atendimento) {
      throw new AppError('Atendimento não encontrado.', 404)
    }

    // 2) Carrega atos do atendimento
    const atos = await prisma.ato.findMany({
      where: { atendimentoId: atendimento.id },
      select: {
        idAto: true,
        statusAto: true,
        seloId: true,
      },
      orderBy: { idAto: 'asc' },
    })

    // Se não houver atos, apenas apaga o atendimento
    if (atos.length === 0) {
      await prisma.atendimento.delete({
        where: { id: atendimento.id },
      })
      return {
        message: 'Atendimento excluído com sucesso (sem atos vinculados).',
        numeroAtendimento: atendimento.numeroAtendimento,
        totalAtos: 0,
        selosDevolvidos: [],
      }
    }

    // 3) Regra de negócio: bloquear se houver ato enviado ao TJCE
    const enviados = atos.filter((a) => a.statusAto)
    if (enviados.length > 0) {
      const idsEnviados = enviados.map((a) => a.idAto)
      throw new AppError(
        `Não é possível excluir o atendimento: existem ${enviados.length} ato(s) já enviados ao TJCE (IDs: ${idsEnviados.join(', ')}).`,
        409,
      )
    }

    // 4) Transação: devolver selos (se houver) e excluir atendimento
    const selosDevolvidos: number[] = []

    await prisma.$transaction(
      async (trx) => {
        // 4.1) Devolver selos e desvincular dos atos
        const comSelo = atos.filter((a) => a.seloId)
        for (const ato of comSelo) {
          // devolve ao estoque
          await trx.selo.update({
            where: { id: ato.seloId! },
            data: { status: 0 },
          })
          selosDevolvidos.push(ato.seloId!)

          // desvincula do ato
          await trx.ato.update({
            where: { idAto: ato.idAto },
            data: { seloId: null },
          })
        }

        // 4.2) Excluir atendimento
        // Com ON DELETE CASCADE:
        //   Atendimento -> apaga Atos -> apaga ImgRTD (PDF) via cascade do Ato
        await trx.atendimento.delete({
          where: { id: atendimento.id },
        })
      },
      { isolationLevel: 'Serializable' },
    )

    return {
      message:
        'Atendimento e atos excluídos com sucesso (PDFs removidos via cascade).',
      numeroAtendimento: atendimento.numeroAtendimento,
      totalAtos: atos.length,
      selosDevolvidos,
    }
  }
}
