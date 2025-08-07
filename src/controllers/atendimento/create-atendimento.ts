import { Request, Response } from 'express'
import { CriarAtendimentoService } from '../../services/atendimento/create-atendimento-service'

export class CreateAtendimentoController {
  async handle(request: Request, response: Response) {
    const { dataAtendimento } = request.body

    const criarAtendimentoService = new CriarAtendimentoService()

    const criarAtendimento = await criarAtendimentoService.execute({
      dataAtendimento,
    })

    return response.json(criarAtendimento)
  }
}
