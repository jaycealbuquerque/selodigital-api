import { Request, Response } from 'express'
import { CreateRecService } from '../../services/rec/create-rec-service'

export class CreateRecController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const createRecService = new CreateRecService()

    const createRec = await createRecService.execute({
      ato,
    })

    return response.json(createRec)
  }
}
