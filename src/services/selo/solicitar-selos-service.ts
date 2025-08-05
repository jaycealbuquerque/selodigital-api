import dayjs from 'dayjs'
import { soapClientPromise } from '../../config/soaap'
import path from 'path'
import 'dotenv/config'
import { AppError } from '../../erros/AppError'
import { prisma } from '../../lib/prisma'

export class SolicitarSelosService {
  async execute(quantidade: number) {
    const codigoServentia = process.env.CODIGO_SERVENTIA
    const ambiente = process.env.AMBIENTE

    function gerarDataHoraAtual() {
      return dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS')
    }

    // Busca o último ID da tabela 'pedido' e incrementa 1
    const ultimoPedido = await prisma.pedido.findFirst({
      orderBy: { id: 'desc' },
    })
    const novoIdSolicitacaoSelo = (ultimoPedido?.id || 0) + 1
    console.log(novoIdSolicitacaoSelo)
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
        solicitante: {
          nomePessoa: 'teste',
          documento: {
            tipoDocumento: 8,
            numero: '24454770344',
          },
        },
        idSolicitacaoSelo: novoIdSolicitacaoSelo,
        itens: {
          itemSolicitacao: [
            {
              sequencial: 1,
              codigoSelo: {
                codigo: 14,
              },
              quantidade,
            },
          ],
        },
      },
    }

    const wsdlPath = path.resolve(
      __dirname,
      '../../config/wsdl/solicitaSelos.wsdl',
    )
    const operation = 'solicitaSelos'

    // async function run(wsdlPath, operation, args) {
    //   try {
    //     const result = await soapClientPromise(wsdlPath, operation, args)
    //     return result
    //   } catch (error) {
    //     console.error('Erro na chamada SOAP:', error)
    //   }
    // }
    // return await run(wsdlPath, operation, args)

    try {
      // Faz a chamada SOAP
      const response = await soapClientPromise(wsdlPath, operation, args)

      const codigoRetorno = response?.return?.codigoRetorno

      // Verifica se existe uma solicitação pendente (MSG010)
      if (codigoRetorno?.codigo === 'MSG010' && codigoRetorno.status === 0) {
        throw new AppError(codigoRetorno.mensagem, 400) // Lança AppError com mensagem e status 400
      }

      const chave = response?.return?.chave
      const cabecalho = response?.return?.cabecalho

      // Verifica se a chave está presente na resposta
      if (!chave) {
        throw new AppError('Chave não encontrada na resposta SOAP.', 400)
      }

      // Salva a chave no banco de dados
      await prisma.pedido.create({
        data: {
          chave,
          dataHora: new Date(cabecalho.dataHora).toISOString(), // Converte para string ISO
          recebido: false,
        },
      })

      // console.log('Pedido salvo com sucesso!')
      // return response
      return {
        message: 'Pedido de selos realizado com sucesso!',
        chave,
      }
    } catch (error) {
      console.error('Erro ao solicitar selos:', error)

      // Lança o erro como AppError, se não for uma instância conhecida
      if (error instanceof AppError) {
        throw error // Propaga o erro para ser tratado pelo middleware global
      }

      // Lança um erro genérico para erros inesperados
      throw new AppError('Erro interno ao solicitar selos.', 500)
    }
  }
}
