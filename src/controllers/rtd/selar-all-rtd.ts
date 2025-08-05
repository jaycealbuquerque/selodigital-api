import { Request, Response } from 'express'
import { SelarAllRtdService } from '../../services/rtd/selar-all-rtd-service'

export class SelarAllRtdController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const selarAllRtdService = new SelarAllRtdService()

    const selarAllRtd = await selarAllRtdService.execute({
      ato,
    })

    return response.json(selarAllRtd)
  }
}
