import { Request, Response } from 'express'
import { ListarAtosPorTipoService } from '../../services/atos/list-all-atos-service'
import { z } from 'zod'
import { AppError } from '../../erros/AppError'

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(10),
  tipoId: z.coerce
    .number()
    .int()
    .positive({ message: 'tipoId deve ser um número positivo' }),
  orderBy: z
    .enum(['createdAt', 'dataAtoPraticado', 'idAto'] as const)
    .default('createdAt'),
  orderDir: z.enum(['asc', 'desc'] as const).default('desc'),
})

export class ListarAtosPorTipoController {
  async handle(req: Request, res: Response) {
    const listarAtosPorTipoService = new ListarAtosPorTipoService()

    const parsed = querySchema.safeParse(req.query)

    if (!parsed.success) {
      const tree = z.treeifyError(parsed.error)
      throw new AppError('Parâmetros inválidos', 400, tree)
    }
    const { page, perPage, tipoId, orderBy, orderDir } = parsed.data

    const listarAtosPorTipo = await listarAtosPorTipoService.execute({
      page,
      perPage,
      tipoId,
      orderBy,
      orderDir,
    })
    return res.json(listarAtosPorTipo)
  }
}
