import { Request, Response } from 'express'
import {
  CreateAutInput,
  CreateAutService,
} from '../../services/aut/create-aut-service'

export class CreateAutController {
  async handle(request: Request, response: Response) {
    const {
      cpfresponsavel,
      solicitante,
      tipoDocumentoDescricao,
      idUsuario,
      numeroAtendimento,
      tipoAtoId,
      quantidade,
    }: CreateAutInput = request.body

    const createAutService = new CreateAutService()

    const createAut = await createAutService.execute({
      cpfresponsavel,
      solicitante,
      tipoDocumentoDescricao,
      idUsuario,
      numeroAtendimento,
      tipoAtoId,
      quantidade,
    })

    return response.json(createAut)
  }
}
