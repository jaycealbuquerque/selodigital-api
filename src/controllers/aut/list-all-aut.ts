import { Request, Response } from 'express'
import { ListAllAutService } from '../../services/aut/list-all-service'

export class ListAllAutController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const listAllAutService = new ListAllAutService()

    const listAllAut = await listAllAutService.execute({
      ato,
    })

    return response.json(listAllAut)
  }
}
