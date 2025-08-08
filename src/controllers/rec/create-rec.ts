import { Request, Response } from 'express'
import {
  CreateRecInput,
  CreateRecService,
} from '../../services/rec/create-rec-service'

export class CreateRecController {
  async handle(request: Request, response: Response) {
    const {
      cpfresponsavel,
      tipoDocumentoDescricao,
      idUsuario,
      numeroAtendimento,
      tipoAtoId,
      quantidade,
      signatario,
      sinalPublico,
    }: CreateRecInput = request.body

    const createRecService = new CreateRecService()

    const createRec = await createRecService.execute({
      cpfresponsavel,
      tipoDocumentoDescricao,
      idUsuario,
      numeroAtendimento,
      tipoAtoId,
      quantidade,
      signatario,
      sinalPublico,
    })

    return response.json(createRec)
  }
}
