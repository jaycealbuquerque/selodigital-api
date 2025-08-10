import { Request, Response } from 'express'
import { ListAllAutService } from '../../services/atos/list-all-service'

export class ListAllAutController {
  async handle(request: Request, response: Response) {
    const { numeroAtendimento } = request.params

    const listAllAutService = new ListAllAutService()

    const listAllAut = await listAllAutService.execute(numeroAtendimento)

    return response.json(listAllAut)
  }
}
