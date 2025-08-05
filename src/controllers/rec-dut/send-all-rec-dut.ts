import { Request, Response } from 'express'
import { SendAllRecDutService } from '../../services/rec-dut/send-all-rec-dut-service'

export class SendAllRecDutController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const sendAllRecDutService = new SendAllRecDutService()

    const sendAllRecDut = await sendAllRecDutService.execute({
      ato,
    })

    return response.json(sendAllRecDut)
  }
}
