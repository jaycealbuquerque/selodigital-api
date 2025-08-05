import { Request, Response } from 'express'
import { SelarAllRecService } from '../../services/rec/selar-all-rec-service'

export class SelarAllRecController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const selarAllRecService = new SelarAllRecService()

    const selarAllRec = await selarAllRecService.execute({
      ato,
    })

    return response.json(selarAllRec)
  }
}
