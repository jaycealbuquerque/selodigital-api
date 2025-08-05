import { Request, Response } from 'express'
import { GetOneRtdService } from '../../services/rtd/get-one-rtd-service'

export class GetOneRtdController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const getOneRtdService = new GetOneRtdService()

    const getOneRtd = await getOneRtdService.execute({
      ato,
    })

    return response.json(getOneRtd)
  }
}
