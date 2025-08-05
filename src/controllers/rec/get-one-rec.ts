import { Request, Response } from 'express'
import { GetOneRecService } from '../../services/rec/get-one-rec-service'

export class GetOneRecController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const getOneRecService = new GetOneRecService()

    const getOneRec = await getOneRecService.execute({
      ato,
    })

    return response.json(getOneRec)
  }
}
