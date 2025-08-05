import { Request, Response } from 'express'
import { DeleteRecDutService } from '../../services/rec-dut/delete-rec-dut-service'

export class DeleteRecDutController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const deleteRecDutService = new DeleteRecDutService()

    const deleteRecDut = await deleteRecDutService.execute({
      ato,
    })

    return response.json(deleteRecDut)
  }
}
