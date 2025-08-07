import { AppError } from '../../erros/AppError'
import { prisma } from '../../lib/prisma'

interface CreateAutInput {
  dataAtoSolicitacao: string
  cpfresponsavel: string
  nomePessoa: string
  tipoDocumento: number
  numeroDocumento: string
  tipoDocumentoDescricao: number
  descricaoDocumento?: string
  idUsuario: number
  numeroAtendimento: string // <- novo campo recebido
  quantidade: number
}

export class CreateAutService {
  async execute({
    cpfresponsavel,
    nomePessoa,
    tipoDocumento,
    numeroDocumento,
    tipoDocumentoDescricao,
    descricaoDocumento,
    idUsuario,
    numeroAtendimento,
    quantidade,
  }: CreateAutInput) {
    // Validação mínima
    if (
      !cpfresponsavel ||
      !nomePessoa ||
      !numeroDocumento ||
      !idUsuario ||
      !numeroAtendimento ||
      !quantidade
    ) {
      throw new AppError('Campos obrigatórios não informados.', 400)
    }

    // 🔎 Busca o atendimento existente pelo número informado
    const atendimento = await prisma.atendimento.findUnique({
      where: { numeroAtendimento: BigInt(numeroAtendimento) },
    })

    if (!atendimento) {
      throw new AppError('Atendimento não encontrado.', 404)
    }

    // Transação para garantir consistência
    return await prisma.$transaction(async (prisma) => {
      // Cria ou atualiza o Solicitante
      const solicitante = await prisma.solicitante.upsert({
        where: { numeroDocumento },
        update: {
          nomePessoa,
          tipoDocumento,
        },
        create: {
          nomePessoa,
          tipoDocumento,
          numeroDocumento,
        },
      })

      // Cria descrição do documento
      const descricaoDoc = await prisma.descricaoDoc.create({
        data: {
          tipoDocumento: tipoDocumentoDescricao,
          descricao: descricaoDocumento || '',
        },
      })

      // Criação do ato
      // Criação de múltiplos atos
      const atosCriados = await Promise.all(
        Array.from({ length: quantidade }).map(() =>
          prisma.ato.create({
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
              codigoAto: '002021', // conforme padrão da autenticação
              seloId: null,
              seloOrigem: null,
              tipoParte: null,
              deficienteVisual: false,
              relativamenteIncapaz: false,
              assinaturaARogo: false,
              renavam: null,
              ressalva: null,
              statusAto: false,
              solicitanteId: solicitante.id,
              descricaoDocId: descricaoDoc.id,
            },
          }),
        ),
      )
      //       return {
      //         message: 'Ato cadastrado com sucesso.!',
      //         // idAto: ato.idAto,
      //         numeroAtendimento: atendimento.numeroAtendimento,
      //       }
      //     })
      //   }
      // }
      return {
        message: `${quantidade} ato(s) cadastrado(s) com sucesso.!`,
        atos: atosCriados.map((ato) => ({
          idAto: ato.idAto,
          numeroAtendimento: atendimento.numeroAtendimento,
        })),
      }
    })
  }
}
