import { Request, Response } from 'express'
import { SendOneRecService } from '../../services/rec/send-one-rec-service'

export class SendOneRecController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const sendOneRecService = new SendOneRecService()

    const sendOneRec = await sendOneRecService.execute({
      ato,
    })

    return response.json(sendOneRec)
  }
}
