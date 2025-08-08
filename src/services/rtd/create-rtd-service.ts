import { AppError } from '../../erros/AppError'
import { prisma } from '../../lib/prisma'

export interface CreateRtdServiceInput {
  cpfresponsavel: string
  idUsuario: number
  numeroAtendimento: string
  tipoAtoId: number
  tipoDocumentoDescricao: number
  seloOrigemComprador: string
  seloOrigemVendedorOuSinalPublico: string
}

export class CreateRtdService {
  async execute({
    cpfresponsavel,
    tipoAtoId,
    tipoDocumentoDescricao,
    idUsuario,
    numeroAtendimento,
    seloOrigemComprador,
    seloOrigemVendedorOuSinalPublico,
  }: CreateRtdServiceInput) {
    if (
      !cpfresponsavel ||
      !tipoAtoId ||
      !tipoDocumentoDescricao ||
      !idUsuario ||
      !numeroAtendimento ||
      !seloOrigemComprador ||
      !seloOrigemVendedorOuSinalPublico
    ) {
      throw new AppError('Campos obrigatórios não informados.', 400)
    }

    const atendimento = await prisma.atendimento.findUnique({
      where: { numeroAtendimento: BigInt(numeroAtendimento) },
    })

    if (!atendimento) {
      throw new AppError('Atendimento não encontrado.', 404)
    }

    return await prisma.$transaction(async (prismaTx) => {
      // Busca o DescricaoDoc já existente
      const descricaoDocExistente = await prismaTx.descricaoDoc.findFirst({
        where: {
          tipoDocumento: tipoDocumentoDescricao,
        },
      })

      if (!descricaoDocExistente) {
        throw new AppError('Descrição do documento não encontrada.', 404)
      }

      // Confirma que o tipo de ato informado existe
      const tipoAto = await prismaTx.tipoAto.findUnique({
        where: { id: tipoAtoId },
      })

      if (!tipoAto) {
        throw new AppError('Tipo de ato não encontrado.', 404)
      }

      // Configurações fixas para os três atos
      const atosParaCriar = [
        { tipoSeloId: 11, codigoAto: '006001' },
        { tipoSeloId: 1, codigoAto: '005023' },
        { tipoSeloId: 99, codigoAto: '006005' },
      ]

      const atosCriados = await Promise.all(
        atosParaCriar.map(({ tipoSeloId, codigoAto }) =>
          prismaTx.ato.create({
            data: {
              atendimentoId: atendimento.id,
              loteId: null,
              valorEmolumento: 40.75,
              valorFermoju: 5.14,
              valorEmolumentoLivre: 9.54,
              tipoCobranca: 1,
              tipoMovimentacao: 4,
              cpfEscrevente: cpfresponsavel,
              idUsuario,
              tipoSeloId,
              codigoAto,
              seloId: null,
              seloOrigemComprador,
              seloOrigemVendedorOuSinalPublico,
              deficienteVisual: false,
              relativamenteIncapaz: false,
              assinaturaARogo: false,
              renavam: null,
              ressalva: null,
              statusAto: false,
              descricaoDocId: descricaoDocExistente.id,
              tipoAtoId,
            },
          }),
        ),
      )

      return {
        message: `3 atos de RTD cadastrados com sucesso!`,
        atos: atosCriados.map((ato) => ({
          idAto: ato.idAto,
          numeroAtendimento: atendimento.numeroAtendimento,
          codigoAto: ato.codigoAto,
          tipoSeloId: ato.tipoSeloId,
        })),
      }
    })
  }
}
