import { Request, Response } from 'express'
import { DeleteAllAtosByAtendimentoService1 } from '../../services/selo/delete-all-ato-service copy'
// import { DeleteAllAtosByAtendimentoService } from '../../services/selo/delete-all-ato-service'

export class DeleteAllAtosByAtendimentoController {
  async handle(request: Request, response: Response) {
    const { numeroAtendimento } = request.body
    const deleteAllAtosByAtendimentoService =
      new DeleteAllAtosByAtendimentoService1()

    const deleteAllAtosByAtendimento =
      await deleteAllAtosByAtendimentoService.execute({
        numeroAtendimento,
      })

    return response.json(deleteAllAtosByAtendimento)
  }
}
