import { Request, Response } from 'express'
import { SendOneRtdService } from '../../services/rtd/send-one-rtd-service'

export class SendOneRtdController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const sendOneRtdService = new SendOneRtdService()

    const sendOneRtd = await sendOneRtdService.execute({
      ato,
    })

    return response.json(sendOneRtd)
  }
}
