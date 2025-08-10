import { Request, Response } from 'express'
import { ListarAtosPorTipoService } from '../../services/atos/list-all-atos-service'

export class ListarAtosPorTipoController {
  async handle(req: Request, res: Response) {
    const { page, perPage, tipoId, orderBy, orderDir } = req.query

    const listarAtosPorTipoService = new ListarAtosPorTipoService()

    const listarAtosPorTipo = await listarAtosPorTipoService.execute({
      page: page ? Number(page) : 1,
      perPage: perPage ? Number(perPage) : 10,
      tipoId: tipoId ? Number(tipoId) : undefined,
      orderBy: (orderBy as any) ?? 'createdAt',
      orderDir: (orderDir as any) ?? 'desc',
    })

    return res.json(listarAtosPorTipo)
  }
}
