import dayjs from 'dayjs'

import path from 'path'

import { config } from 'dotenv'
import { soapClientPromise } from '../../config/soaap'
import { AppError } from '../../erros/AppError'
import { prisma } from '../../lib/prisma'

config()

export class ReceberSelosService {
  async execute() {
    const pedido = await prisma.pedido.findFirst({
      where: { recebido: false },
    })

    if (!pedido) {
      throw new AppError('Nenhum pedido pendente encontrado.', 404)
    }
    // Verifica se a chave já existe e se já foi recebida
    // const pedido = await prisma.pedido.findUnique({ where: { chave } })

    // if (!pedido) {
    //   throw new AppError('Chave informada incorreta.', 404)
    // }

    if (pedido.recebido) {
      throw new AppError('Este pedido já foi recepcionado.', 400)
    }

    const { chave } = pedido
    const codigoServentia = process.env.CODIGO_SERVENTIA
    const ambiente = process.env.AMBIENTE

    function gerarDataHoraAtual() {
      return dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS')
    }

    const args = {
      arg0: {
        cabecalho: {
          versao: '1.12',
          dataHora: gerarDataHoraAtual(),
          ambiente,
          serventia: {
            codigoServentia,
          },
        },
        chave,
      },
    }
    const wsdlPath = path.resolve(
      __dirname,
      '../../config/wsdl/homologacao/ReceberSelos.wsdl',
    )
    const operation = 'receberSelos'

    try {
      const result = await soapClientPromise(wsdlPath, operation, args)

      // const codigoRetorno = result?.return?.codigoRetorno
      const codigoRetorno = result?.return?.codigoRetorno

      // Verificar se o pedido ainda está pendente de processamento (MSG003)
      if (codigoRetorno?.codigo === 'MSG003' && codigoRetorno.status === 1) {
        throw new AppError('Solicitação ainda pendente de processamento.', 400)
      }
      // Verificar se a chave é inválida
      if (codigoRetorno?.codigo === 'MSG011' && codigoRetorno.status === 0) {
        throw new AppError(codigoRetorno.mensagem) // Lança erro se a chave for inválida
      }

      // Verificar se há itens na resposta
      const itens = result?.return?.itens?.itemSolicitacao || []

      // Percorrer os selos e salvar cada um no banco de dados
      for (const item of itens) {
        const status = item.status.status
        // Tratamento específico para pedidos cancelados (MSG035)
        if (item.status.codigo === 'MSG035' && status === 0) {
          console.log('Pedido cancelado pelo TJ:', item.status.mensagem)

          // Marcar o pedido como recebido para permitir novas solicitações
          await prisma.pedido.update({
            where: { chave },
            data: { recebido: true },
          })

          return {
            message:
              'Pedido cancelado pelo TJ. Favor fazer uma nova solicitação.',
          }
        }
        if (item.status.codigo === 'MSG037') {
          throw new AppError(
            'Item da solicitação já foi entregue para serventia.',
          )
        }

        for (const selo of item.seloRecebimento) {
          await prisma.selo.create({
            data: {
              codigoSelo: selo.codigoSelo.codigo.toString(),
              numeroSerie: selo.numeroSerie,
              validador: selo.validador,
              status,
              chave: BigInt(chave),
            },
          })
        }
      }

      // Marcar o pedido como recebido
      await prisma.pedido.update({
        where: { chave },
        data: { recebido: true },
      })

      // return result // Retorna o resultado para o controller

      return {
        message: 'Selos recebidos com sucesso.',
      }
    } catch (error) {
      console.error('Erro ao receber selos:', error)
      // Verifica se é um erro conhecido (AppError) e propaga
      if (error instanceof AppError) {
        throw error // Propaga para o middleware global
      }

      // Se for um erro desconhecido, lança como erro interno
      throw new AppError('Erro interno ao receber selos.', 500)
    }
  }
}
