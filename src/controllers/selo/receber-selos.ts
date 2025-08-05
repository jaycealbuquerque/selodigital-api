import { Request, Response } from 'express'
import { ReceberSelosService } from '../../services/selo/receber-selos-service'

export class ReceberSelosController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const receberSelosService = new ReceberSelosService()

    const receberSelos = await receberSelosService.execute({
      ato,
    })

    return response.json(receberSelos)
  }
}
