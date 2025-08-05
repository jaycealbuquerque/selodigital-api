import { Request, Response } from 'express'
import { DeleteAutService } from '../../services/aut/delete-aut-service'

export class DeleteAutController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const deleteAutService = new DeleteAutService()

    const deleteAut = await deleteAutService.execute({
      ato,
    })

    return response.json(deleteAut)
  }
}
