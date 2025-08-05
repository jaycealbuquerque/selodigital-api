import { Request, Response } from 'express'
import { ListAllRecService } from '../../services/rec/list-all-rec-service'

export class ListAllRecController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const listAllRecService = new ListAllRecService()

    const listAllRec = await listAllRecService.execute({
      ato,
    })

    return response.json(listAllRec)
  }
}
