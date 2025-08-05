import { Request, Response } from 'express'
import { SelarOneRecDutService } from '../../services/rec-dut/selar-one-rec-dut-service'

export class SelarOneRecDutController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const selarOneRecDutService = new SelarOneRecDutService()

    const selarOneRecDut = await selarOneRecDutService.execute({
      ato,
    })

    return response.json(selarOneRecDut)
  }
}
