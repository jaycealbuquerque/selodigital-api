// services/rtd/create-rtd-service.ts
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
  pdfBase64?: string // <- NOVO
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
    pdfBase64,
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

    // (Opcional) Caso PDF seja obrigatório:
    // if (!pdfBase64) throw new AppError('PDF é obrigatório.', 400)

    const atendimento = await prisma.atendimento.findUnique({
      where: { numeroAtendimento: BigInt(numeroAtendimento) },
    })
    if (!atendimento) throw new AppError('Atendimento não encontrado.', 404)

    return await prisma.$transaction(async (prismaTx) => {
      const descricaoDocExistente = await prismaTx.descricaoDoc.findFirst({
        where: { tipoDocumento: tipoDocumentoDescricao },
      })
      if (!descricaoDocExistente) {
        throw new AppError('Descrição do documento não encontrada.', 404)
      }

      const tipoAto = await prismaTx.tipoAto.findUnique({
        where: { id: tipoAtoId },
      })
      if (!tipoAto) throw new AppError('Tipo de ato não encontrado.', 404)

      // mesma configuração
      const atosParaCriar = [
        { tipoSeloId: 11, codigoAto: '006001' }, // <- aqui vai o PDF
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

      // Se veio PDF, relaciona SOMENTE no ato 11 / 006001
      if (pdfBase64) {
        const alvo = atosCriados.find(
          (a) => a.tipoSeloId === 11 && a.codigoAto === '006001',
        )
        if (!alvo) {
          throw new AppError('Ato alvo (11/006001) não encontrado.', 500)
        }

        // cria ImgRTD
        const img = await prismaTx.imgRTD.create({
          data: { imagemRTD: pdfBase64 },
        })

        // Conecta no ato alvo
        // >>> ATENÇÃO: ajuste conforme seu schema de relação <<<
        // Caso o Ato tenha a FK: imgRTDId Int?:
        await prismaTx.ato.update({
          where: { idAto: alvo.idAto },
          data: {
            imgId: img.id, // se seu Ato tiver este campo
            // ou: imgRTD: { connect: { id: img.id } } se o relation estiver nomeado assim
          },
        })
      }

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
