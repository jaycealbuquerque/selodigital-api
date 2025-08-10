import { Request, Response } from 'express'
import { DeleteOneAtoService } from '../../services/atos/delete-one-ato-service'

export class DeleteOneAtoController {
  async handle(request: Request, response: Response) {
    const { idAto } = request.body
    const deleteOneAtoService = new DeleteOneAtoService()

    const deleteOneAto = await deleteOneAtoService.execute({
      idAto,
    })

    return response.json(deleteOneAto)
  }
}
