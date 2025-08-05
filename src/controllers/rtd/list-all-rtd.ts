import { Request, Response } from 'express'
import { ListAllRtdService } from '../../services/rtd/list-all-rtd-service'

export class ListAllRtdController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const listAllRtdService = new ListAllRtdService()

    const listAllRtd = await listAllRtdService.execute({
      ato,
    })

    return response.json(listAllRtd)
  }
}
