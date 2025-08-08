import { AppError } from '../../erros/AppError'
import { prisma } from '../../lib/prisma'

export interface CreateAutInput {
  cpfresponsavel: string
  idUsuario: number
  numeroAtendimento: string // <- novo campo recebido
  tipoAtoId: number
  tipoDocumentoDescricao: number
  quantidade: number
  solicitante: {
    nomePessoa: string
    tipoDocumento: number
    numeroDocumento: string
    telefone: {
      tipoTelefone: number
      dddTelefone: string
      numeroTelefone: string
    }
  }
}

export class CreateAutService {
  async execute({
    cpfresponsavel,
    solicitante,
    tipoDocumentoDescricao,
    idUsuario,
    numeroAtendimento,
    tipoAtoId,
    quantidade,
  }: CreateAutInput) {
    // Validação mínima
    if (
      !cpfresponsavel ||
      !solicitante ||
      !tipoDocumentoDescricao ||
      !idUsuario ||
      !numeroAtendimento ||
      !tipoAtoId ||
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
      // Cria o telefone do solicitante
      const telefoneCriado = await prisma.telefone.create({
        data: {
          tipoTelefone: solicitante.telefone.tipoTelefone,
          dddTelefone: solicitante.telefone.dddTelefone,
          numeroTelefone: solicitante.telefone.numeroTelefone,
        },
      })
      // Cria ou atualiza o Solicitante
      const solicitanteCriado = await prisma.solicitante.upsert({
        where: { numeroDocumento: solicitante.numeroDocumento },
        update: {
          nomePessoa: solicitante.nomePessoa,
          tipoDocumento: solicitante.tipoDocumento,
          telefoneId: telefoneCriado.id,
        },
        create: {
          nomePessoa: solicitante.nomePessoa,
          tipoDocumento: solicitante.tipoDocumento,
          numeroDocumento: solicitante.numeroDocumento,
          telefoneId: telefoneCriado.id,
        },
      })

      // Busca o DescricaoDoc já existente
      const descricaoDocExistente = await prisma.descricaoDoc.findFirst({
        where: {
          tipoDocumento: tipoDocumentoDescricao,
        },
      })

      if (!descricaoDocExistente) {
        throw new AppError('Descrição do documento não encontrada.', 404)
      }

      // Confirma que o tipo de ato informado existe
      const tipoAto = await prisma.tipoAto.findUnique({
        where: { id: tipoAtoId },
      })

      if (!tipoAto) {
        throw new AppError('Tipo de ato não encontrado.', 404)
      }

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
              tipoSeloId: 3,
              codigoAto: '002021', // conforme padrão da autenticação
              seloId: null,
              seloOrigemVendedorOuSinalPublico: null,
              tipoParte: null,
              deficienteVisual: false,
              relativamenteIncapaz: false,
              assinaturaARogo: false,
              renavam: null,
              ressalva: null,
              statusAto: false,
              solicitanteId: solicitanteCriado.id,
              descricaoDocId: descricaoDocExistente.id,
              tipoAtoId,
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
