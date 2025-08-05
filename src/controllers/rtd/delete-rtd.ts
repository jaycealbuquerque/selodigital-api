import { Request, Response } from 'express'
import { DeleteRtdService } from '../../services/rtd/delete-rtd-service'

export class DeleteRtdController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const deleteRtdService = new DeleteRtdService()

    const deleteRtd = await deleteRtdService.execute({
      ato,
    })

    return response.json(deleteRtd)
  }
}
