import { Request, Response } from 'express'
import { SendOneRecDutService } from '../../services/rec-dut/send-one-rec-dut-service'

export class SendOneRecDutController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const sendOneRecDutService = new SendOneRecDutService()

    const sendOneRecDut = await sendOneRecDutService.execute({
      ato,
    })

    return response.json(sendOneRecDut)
  }
}
