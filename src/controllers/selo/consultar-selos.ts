import { Request, Response } from 'express'
import { ConsultarSelosService } from '../../services/selo/consultar-selos-service'

export class ConsultarSelosController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const consultarSelosService = new ConsultarSelosService()

    const consultarSelos = await consultarSelosService.execute({
      ato,
    })

    return response.json(consultarSelos)
  }
}
