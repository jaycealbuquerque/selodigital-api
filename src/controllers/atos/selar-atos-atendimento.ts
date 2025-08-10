import { Request, Response } from 'express'
import { SelarAtosPorAtendimentoService } from '../../services/atos/selar-atos-service'

export class SelarAtosAtendimentoController {
  async handle(request: Request, response: Response) {
    const { numeroAtendimento } = request.body
    const selarAtosPorAtendimentoService = new SelarAtosPorAtendimentoService()

    const selarAtosPorAtendimento =
      await selarAtosPorAtendimentoService.execute({ numeroAtendimento })

    return response.json(selarAtosPorAtendimento)
  }
}
