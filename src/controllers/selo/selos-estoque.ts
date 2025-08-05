import { Request, Response } from 'express'
import { SelosEstoqueService } from '../../services/selo/selos-estoque-service'

export class SelosEstoqueController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const selosEstoqueService = new SelosEstoqueService()

    const selosEstoque = await selosEstoqueService.execute({
      ato,
    })

    return response.json(selosEstoque)
  }
}
