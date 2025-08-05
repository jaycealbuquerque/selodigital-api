import { Request, Response } from 'express'
import { SelarOneRtdService } from '../../services/rtd/selar-one-rtd-service'

export class SelarOneRtdController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const selarOneRtdService = new SelarOneRtdService()

    const selarOneRtd = await selarOneRtdService.execute({
      ato,
    })

    return response.json(selarOneRtd)
  }
}
