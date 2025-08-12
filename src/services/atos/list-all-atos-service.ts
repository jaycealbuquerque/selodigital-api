import { AppError } from '../../erros/AppError'
import { prisma } from '../../lib/prisma'
// import { Prisma } from '@prisma/client'

interface PaginatedResponse<T> {
  first: number
  prev: number | null
  next: number | null
  last: number
  pages: number
  items: number
  data: T[]
}

interface ListarAtosPorTipoInput {
  page?: number
  perPage?: number
  tipoId: number
  orderBy?: 'createdAt' | 'dataAtoPraticado' | 'idAto'
  orderDir?: 'asc' | 'desc'
}

type ParteDTO = {
  tipo: 'solicitante' | 'signatario' | 'indefinido'
  nome: string | null
  documento: string | null
}

type AtoDTO = {
  idAto: number
  dataAtoPraticado: Date | null
  seloId: number | null
  tipoParte: number | null
  statusAto: boolean
  cpfEscrevente: string
  usuario: { nome: string }
  atendimento: { numeroAtendimento: string } // BigInt → string
  // Campo “achatado” para consumir no front:
  parte: ParteDTO
  // (Opcional) objetos crus, caso precise de mais campos depois:
  solicitante?: { nomePessoa: string; numeroDocumento: string | null } | null
  signatario?: { nomePessoa: string; numeroDocumento: string | null } | null
  selo: { codigoSelo: string; numeroSerie: string; validador: string } | null
}

export class ListarAtosPorTipoService {
  async execute({
    page = 1,
    perPage = 10,
    tipoId,
    orderBy = 'createdAt',
    orderDir = 'desc',
  }: ListarAtosPorTipoInput): Promise<PaginatedResponse<AtoDTO>> {
    if (!tipoId || Number.isNaN(Number(tipoId))) {
      throw new AppError('Informe um "tipoId" válido.', 400)
    }

    const where = { tipoAtoId: Number(tipoId) }

    const totalItems = await prisma.ato.count({ where })
    if (totalItems === 0) {
      throw new AppError('Não há atos para o tipo informado.', 404)
    }

    const totalPages = Math.ceil(totalItems / perPage)
    const pageSafe = Math.min(Math.max(page, 1), Math.max(totalPages, 1))
    const skip = (pageSafe - 1) * perPage

    // const orderByClause: Prisma.AtoOrderByWithRelationInput = {
    //   [orderBy]: orderDir,
    // }

    const atos = await prisma.ato.findMany({
      where,
      select: {
        idAto: true,
        seloId: true,
        tipoParte: true,
        statusAto: true,
        cpfEscrevente: true,
        usuario: { select: { nome: true } },
        atendimento: { select: { numeroAtendimento: true } }, // BigInt
        // <<< inclui ambos >>>
        solicitante: { select: { nomePessoa: true, numeroDocumento: true } },
        Signatario: { select: { nomePessoa: true, numeroDocumento: true } },
        selo: {
          select: { codigoSelo: true, numeroSerie: true, validador: true },
        },
        createdAt: true,
      },
      orderBy: { [orderBy]: orderDir },
      // orderBy: orderByClause,
      skip,
      take: perPage,
    })

    const data: AtoDTO[] = atos.map((a) => {
      // regra: prioriza signatário se existir, senão solicitante; senão indefinido
      let parte: ParteDTO = { tipo: 'indefinido', nome: null, documento: null }
      if (a.Signatario) {
        parte = {
          tipo: 'signatario',
          nome: a.Signatario.nomePessoa ?? null,
          documento: a.Signatario.numeroDocumento ?? null,
        }
      } else if (a.solicitante) {
        parte = {
          tipo: 'solicitante',
          nome: a.solicitante.nomePessoa ?? null,
          documento: a.solicitante.numeroDocumento ?? null,
        }
      }

      return {
        idAto: a.idAto,
        seloId: a.seloId,
        tipoParte: a.tipoParte,
        statusAto: a.statusAto,
        cpfEscrevente: a.cpfEscrevente,
        usuario: a.usuario,
        atendimento: {
          numeroAtendimento: a.atendimento.numeroAtendimento.toString(),
        },
        parte,
        solicitante: a.solicitante
          ? {
              nomePessoa: a.solicitante.nomePessoa,
              numeroDocumento: a.solicitante.numeroDocumento ?? null,
            }
          : null,
        signatario: a.Signatario
          ? {
              nomePessoa: a.Signatario.nomePessoa,
              numeroDocumento: a.Signatario.numeroDocumento ?? null,
            }
          : null,
        selo: a.selo ?? null,
      }
    })

    return {
      first: 1,
      prev: pageSafe > 1 ? pageSafe - 1 : null,
      next: pageSafe < totalPages ? pageSafe + 1 : null,
      last: totalPages,
      pages: totalPages,
      items: totalItems,
      data,
    }
  }
}
