import { Request, Response } from 'express'
import { SolicitarSelosService } from '../../services/selo/solicitar-selos-service'

export class SolicitarSelosController {
  async handle(request: Request, response: Response) {
    const { itens } = request.body

    const solicitarSelosService = new SolicitarSelosService()

    const solicitarSelos = await solicitarSelosService.execute(itens)

    return response.json(solicitarSelos)
  }
}
