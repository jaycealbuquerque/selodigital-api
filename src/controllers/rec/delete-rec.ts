import { Request, Response } from 'express'
import { DeleteRecService } from '../../services/rec/delete-rec-service'

export class DeleteRecController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const deleteRecService = new DeleteRecService()

    const deleteRec = await deleteRecService.execute({
      ato,
    })

    return response.json(deleteRec)
  }
}
