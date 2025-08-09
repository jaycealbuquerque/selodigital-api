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
  pdfBase64?: string // PDF opcional (apenas para {tipoSeloId:11, codigoAto:'006001'})
}

const ATO_COM_PDF = { tipoSeloId: 11, codigoAto: '006001' } as const

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
    // Validação básica
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

    // Busca atendimento
    const atendimento = await prisma.atendimento.findUnique({
      where: { numeroAtendimento: BigInt(numeroAtendimento) },
      select: { id: true, numeroAtendimento: true },
    })
    if (!atendimento) throw new AppError('Atendimento não encontrado.', 404)

    // Execução em transação
    return await prisma.$transaction(
      async (tx) => {
        // Documento
        const descricaoDoc = await tx.descricaoDoc.findFirst({
          where: { tipoDocumento: tipoDocumentoDescricao },
          select: { id: true },
        })
        if (!descricaoDoc) {
          throw new AppError('Descrição do documento não encontrada.', 404)
        }

        // Tipo de ato
        const tipoAto = await tx.tipoAto.findUnique({
          where: { id: tipoAtoId },
          select: { id: true },
        })
        if (!tipoAto) throw new AppError('Tipo de ato não encontrado.', 404)

        // Conjunto de atos da sua regra
        const atosParaCriar = [
          ATO_COM_PDF, // terá PDF (se enviado)
          { tipoSeloId: 1, codigoAto: '005023' },
          { tipoSeloId: 99, codigoAto: '006005' },
        ] as const

        // Cria os atos
        const atosCriados = await Promise.all(
          atosParaCriar.map(({ tipoSeloId, codigoAto }) =>
            tx.ato.create({
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
                descricaoDocId: descricaoDoc.id,
                tipoAtoId: tipoAto.id,
              },
              select: {
                idAto: true,
                tipoSeloId: true,
                codigoAto: true,
              },
            }),
          ),
        )

        // Se veio PDF, anexar somente ao ato {11, '006001'}
        if (pdfBase64) {
          // validação simples do base64 (opcional, mas útil)
          const looksLikeBase64 =
            typeof pdfBase64 === 'string' &&
            /^[A-Za-z0-9+/=\r\n]+$/.test(pdfBase64.trim())

          if (!looksLikeBase64) {
            throw new AppError('PDF inválido (base64 esperado).', 400)
          }

          const alvo = atosCriados.find(
            (a) =>
              a.tipoSeloId === ATO_COM_PDF.tipoSeloId &&
              a.codigoAto === ATO_COM_PDF.codigoAto,
          )
          if (!alvo) {
            // Em teoria não deve acontecer, mas protegemos
            throw new AppError('Ato alvo (11/006001) não encontrado.', 500)
          }

          // Cria o registro do PDF apontando para o Ato (FK: ImgRTD.atoId)
          await tx.imgRTD.create({
            data: {
              imagemRTD: pdfBase64,
              atoId: alvo.idAto,
            },
          })
        }

        return {
          message: '3 atos de RTD cadastrados com sucesso!',
          atos: atosCriados.map((ato) => ({
            idAto: ato.idAto,
            numeroAtendimento: atendimento.numeroAtendimento,
            codigoAto: ato.codigoAto,
            tipoSeloId: ato.tipoSeloId,
          })),
        }
      },
      { isolationLevel: 'Serializable' },
    )
  }
}
