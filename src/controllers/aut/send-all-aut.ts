import { Request, Response } from 'express'
import { SendAllService } from '../../services/aut/send-all-service'

export class SendAllController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const sendAllService = new SendAllService()

    const sendAll = await sendAllService.execute({
      ato,
    })

    return response.json(sendAll)
  }
}
