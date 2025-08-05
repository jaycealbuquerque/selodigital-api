import { Request, Response } from 'express'
import { CreateRtdService } from '../../services/rtd/create-rtd-service'

export class CreateRtdController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const createRtdService = new CreateRtdService()

    const createRtd = await createRtdService.execute({
      ato,
    })

    return response.json(createRtd)
  }
}
