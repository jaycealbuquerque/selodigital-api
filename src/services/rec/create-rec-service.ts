import { AppError } from '../../erros/AppError'
import { prisma } from '../../lib/prisma'

export interface CreateRecInput {
  cpfresponsavel: string
  idUsuario: number
  numeroAtendimento: string
  tipoAtoId: number
  tipoDocumentoDescricao: number
  quantidade: number
  signatario: {
    nomePessoa: string
    tipoDocumento: number
    numeroDocumento: string
    telefone: {
      tipoTelefone: number
      dddTelefone: string
      numeroTelefone: string
    }
  }
  sinalPublico?: {
    nomeOficioSignatario: string
    cidadeOficio?: string
    estadoOficio?: string
    seloUtilizado?: string
  }
}

export class CreateRecService {
  async execute({
    cpfresponsavel,
    tipoDocumentoDescricao,
    idUsuario,
    numeroAtendimento,
    tipoAtoId,
    quantidade,
    signatario,
    sinalPublico,
  }: CreateRecInput) {
    if (
      !cpfresponsavel ||
      !tipoDocumentoDescricao ||
      !signatario ||
      !idUsuario ||
      !numeroAtendimento ||
      !tipoAtoId ||
      !signatario ||
      !quantidade
    ) {
      throw new AppError('Campos obrigatórios não informados.', 400)
    }

    const atendimento = await prisma.atendimento.findUnique({
      where: { numeroAtendimento: BigInt(numeroAtendimento) },
    })

    if (!atendimento) {
      throw new AppError('Atendimento não encontrado.', 404)
    }

    return await prisma.$transaction(async (prisma) => {
      // Cria o telefone do solicitante
      const telefoneCriado = await prisma.telefone.create({
        data: {
          tipoTelefone: signatario.telefone.tipoTelefone,
          dddTelefone: signatario.telefone.dddTelefone,
          numeroTelefone: signatario.telefone.numeroTelefone,
        },
      })
      // Cria ou atualiza o signatário
      const signatarioCriado = await prisma.signatario.upsert({
        where: { numeroDocumento: signatario.numeroDocumento },
        update: {
          nomePessoa: signatario.nomePessoa,
          tipoDocumento: signatario.tipoDocumento,
          telefoneId: telefoneCriado.id,
        },
        create: {
          nomePessoa: signatario.nomePessoa,
          tipoDocumento: signatario.tipoDocumento,
          numeroDocumento: signatario.numeroDocumento,
          telefoneId: telefoneCriado.id,
        },
      })

      // Se sinal público for enviado, cria ou atualiza
      if (sinalPublico) {
        if (signatarioCriado.sinalPublicoId) {
          await prisma.sinalPublico.update({
            where: { id: signatarioCriado.sinalPublicoId },
            data: {
              nomeOficioSignatario: sinalPublico.nomeOficioSignatario,
              cidadeOficio: sinalPublico.cidadeOficio || null,
              estadoOficio: sinalPublico.estadoOficio || null,
              seloUtilizado: sinalPublico.seloUtilizado || null,
            },
          })
        } else {
          const novoSinalPublico = await prisma.sinalPublico.create({
            data: {
              nomeOficioSignatario: sinalPublico.nomeOficioSignatario,
              cidadeOficio: sinalPublico.cidadeOficio || null,
              estadoOficio: sinalPublico.estadoOficio || null,
              seloUtilizado: sinalPublico.seloUtilizado || null,
              Signatario: {
                connect: { id: signatarioCriado.id },
              },
            },
          })

          // Atualiza o signatário com o novo sinal público
          await prisma.signatario.update({
            where: { id: signatarioCriado.id },
            data: {
              sinalPublicoId: novoSinalPublico.id,
            },
          })
        }
      }

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
              tipoSeloId: 2,
              codigoAto: '002021',
              seloId: null,
              seloOrigemVendedorOuSinalPublico: null,
              tipoParte: null,
              deficienteVisual: false,
              relativamenteIncapaz: false,
              assinaturaARogo: false,
              renavam: null,
              ressalva: null,
              statusAto: false,
              numeroCartaoAutografo: signatarioCriado.id,
              descricaoDocId: descricaoDocExistente.id,
              tipoAtoId,
            },
          }),
        ),
      )

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
