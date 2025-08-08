import { Request, Response } from 'express'
import {
  CreateRtdService,
  CreateRtdServiceInput,
} from '../../services/rtd/create-rtd-service'

export class CreateRtdController {
  async handle(request: Request, response: Response) {
    const {
      cpfresponsavel,
      tipoAtoId,
      tipoDocumentoDescricao,
      idUsuario,
      numeroAtendimento,
      seloOrigemComprador,
      seloOrigemVendedorOuSinalPublico,
    }: CreateRtdServiceInput = request.body

    const createRtdService = new CreateRtdService()

    const createRtd = await createRtdService.execute({
      cpfresponsavel,
      tipoAtoId,
      tipoDocumentoDescricao,
      idUsuario,
      numeroAtendimento,
      seloOrigemComprador,
      seloOrigemVendedorOuSinalPublico,
    })

    return response.json(createRtd)
  }
}
