import { Request, Response } from 'express'
import { GetOneAutService } from '../../services/aut/get-one-service'

export class GetOneAutController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const getOneAutService = new GetOneAutService()

    const getOneAut = await getOneAutService.execute({
      ato,
    })

    return response.json(getOneAut)
  }
}
