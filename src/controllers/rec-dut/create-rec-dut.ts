import { Request, Response } from 'express'
import {
  CreateRecDutInput,
  CreateRecDutService,
} from '../../services/rec-dut/create-rec-dut-service'

export class CreateRecDutController {
  async handle(request: Request, response: Response) {
    const {
      cpfresponsavel,
      tipoAtoId,
      tipoDocumentoDescricao,
      idUsuario,
      numeroAtendimento,
      tipoParte,
      seloOrigemVendedorOuSinalPublico,
      quantidade,
      signatario,
      sinalPublico,
    }: CreateRecDutInput = request.body

    const createRecDutService = new CreateRecDutService()

    const createRecDut = await createRecDutService.execute({
      cpfresponsavel,
      tipoAtoId,
      tipoDocumentoDescricao,
      idUsuario,
      numeroAtendimento,
      tipoParte,
      seloOrigemVendedorOuSinalPublico,
      quantidade,
      signatario,
      sinalPublico,
    })

    return response.json(createRecDut)
  }
}
