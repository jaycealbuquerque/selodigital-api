import { Request, Response } from 'express'
import { ListAllRecDutService } from '../../services/rec-dut/list-all-rec-dut-service'

export class ListAllRecDutController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const listAllRecDutService = new ListAllRecDutService()

    const listAllRecDut = await listAllRecDutService.execute({
      ato,
    })

    return response.json(listAllRecDut)
  }
}
