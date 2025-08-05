import { Request, Response } from 'express'
import { SendAllRecService } from '../../services/rec/send-all-rec-service'

export class SendAllRecController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const sendAllRecService = new SendAllRecService()

    const sendAllRec = await sendAllRecService.execute({
      ato,
    })

    return response.json(sendAllRec)
  }
}
