import { Request, Response } from 'express'
import { GetOneRecDutService } from '../../services/rec-dut/get-one-rec-dut-service'

export class GetOneRecDutController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const getOneRecDutService = new GetOneRecDutService()

    const getOneRecDut = await getOneRecDutService.execute({
      ato,
    })

    return response.json(getOneRecDut)
  }
}
