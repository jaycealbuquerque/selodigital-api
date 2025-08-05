import { Request, Response } from 'express'
import { CreateAutService } from '../../services/aut/create-aut-service'

export class CreateAutController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const createAutService = new CreateAutService()

    const createAut = await createAutService.execute({
      ato,
    })

    return response.json(createAut)
  }
}
