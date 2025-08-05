import { Request, Response } from 'express'
import { SelarAllAutService } from '../../services/aut/selar-all-service'

export class SelarAllAutController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const selarAllAutService = new SelarAllAutService()

    const selarAllAut = await selarAllAutService.execute({
      ato,
    })

    return response.json(selarAllAut)
  }
}
