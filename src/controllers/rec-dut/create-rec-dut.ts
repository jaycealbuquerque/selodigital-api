import { Request, Response } from 'express'
import { CreateRecDutService } from '../../services/rec-dut/create-rec-dut-service'

export class CreateRecDutController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const createRecDutService = new CreateRecDutService()

    const createRecDut = await createRecDutService.execute({
      ato,
    })

    return response.json(createRecDut)
  }
}
