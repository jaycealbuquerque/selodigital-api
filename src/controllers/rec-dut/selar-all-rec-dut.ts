import { Request, Response } from 'express'
import { SelarAllRecDutService } from '../../services/rec-dut/selar-all-rec-dut-service'

export class SelarAllRecDutController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const selarAllRecDutService = new SelarAllRecDutService()

    const selarAllRecDut = await selarAllRecDutService.execute({
      ato,
    })

    return response.json(selarAllRecDut)
  }
}
