import { Request, Response } from 'express'
import { SendAllRtdService } from '../../services/rtd/send-all-rtd-service'

export class SendAllRtdController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const sendAllRtdService = new SendAllRtdService()

    const sendAllRtd = await sendAllRtdService.execute({
      ato,
    })

    return response.json(sendAllRtd)
  }
}
