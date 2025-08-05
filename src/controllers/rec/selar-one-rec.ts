import { Request, Response } from 'express'
import { SelarOneRecService } from '../../services/rec/selar-one-rec-service'

export class SelarOneRecController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const selarOneRecService = new SelarOneRecService()

    const selarOneRec = await selarOneRecService.execute({
      ato,
    })

    return response.json(selarOneRec)
  }
}
