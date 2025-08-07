import { Request, Response } from 'express'
import { GetOneAutService } from '../../services/aut/get-one-service'

export class GetOneAutController {
  async handle(request: Request, response: Response) {
    const { idAto } = request.params

    const getOneAutService = new GetOneAutService()

    const getOneAut = await getOneAutService.execute(idAto)

    return response.json(getOneAut)
  }
}
