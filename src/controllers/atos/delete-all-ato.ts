import { Request, Response } from 'express'
import { DeleteAllAtosByAtendimentoService } from '../../services/atos/delete-all-ato-service'

export class DeleteAllAtosByAtendimentoController {
  async handle(request: Request, response: Response) {
    const { numeroAtendimento } = request.body
    const deleteAllAtosByAtendimentoService =
      new DeleteAllAtosByAtendimentoService()

    const deleteAllAtosByAtendimento =
      await deleteAllAtosByAtendimentoService.execute({
        numeroAtendimento,
      })

    return response.json(deleteAllAtosByAtendimento)
  }
}
