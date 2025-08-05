import { Request, Response } from 'express'
import { SendOneService } from '../../services/aut/send-one-service'

export class SendOneController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const sendOneService = new SendOneService()

    const sendOne = await sendOneService.execute({
      ato,
    })

    return response.json(sendOne)
  }
}
