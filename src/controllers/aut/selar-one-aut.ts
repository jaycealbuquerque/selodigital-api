import { Request, Response } from 'express'
import { SelarOneService } from '../../services/aut/selar-one-service'

export class SelarOneController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const selarOneService = new SelarOneService()

    const selarOne = await selarOneService.execute({
      ato,
    })

    return response.json(selarOne)
  }
}
