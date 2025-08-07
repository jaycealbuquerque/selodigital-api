import { Request, Response } from 'express'
import { CreateAutService } from '../../services/aut/create-aut-service'

export class CreateAutController {
  async handle(request: Request, response: Response) {
    const {
      cpfresponsavel,
      nomePessoa,
      tipoDocumento,
      numeroDocumento,
      tipoDocumentoDescricao,
      descricaoDocumento,
      idUsuario,
      numeroAtendimento,
      quantidade,
    } = request.body

    const createAutService = new CreateAutService()

    const createAut = await createAutService.execute({
      cpfresponsavel,
      nomePessoa,
      tipoDocumento,
      numeroDocumento,
      tipoDocumentoDescricao,
      descricaoDocumento,
      idUsuario,
      numeroAtendimento,
      quantidade,
    })

    return response.json(createAut)
  }
}
