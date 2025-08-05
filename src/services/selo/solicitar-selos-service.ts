import dayjs from 'dayjs'
import path from 'path'
import 'dotenv/config'
import { AppError } from '../../erros/AppError'
import { prisma } from '../../lib/prisma'
import { soapClientPromise } from '../../config/soaap'
import { gerarNumeroSequencial } from '../../utils/gerarNumero14digitos'

interface ItemSolicitacaoInput {
  codigo: number
  quantidade: number
}

export class SolicitarSelosService {
  async execute(itens: ItemSolicitacaoInput[]) {
    const codigoServentia = process.env.CODIGO_SERVENTIA
    const ambiente = process.env.AMBIENTE

    const gerarDataHoraAtual = () => dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS')

    const ultimoPedido = await prisma.pedido.findFirst({
      orderBy: { id: 'desc' },
    })
    const novoIdSolicitacaoSelo = gerarNumeroSequencial(ultimoPedido?.id, 10)

    const selosPermitidos = await this.buscarSelosPermitidos()
    const itensSolicitacao = this.validarEMontarItens(itens, selosPermitidos)

    const args = {
      arg0: {
        cabecalho: {
          versao: '1.12',
          dataHora: gerarDataHoraAtual(),
          ambiente,
          serventia: { codigoServentia },
        },
        solicitante: {
          nomePessoa: 'teste',
          documento: { tipoDocumento: 8, numero: '24454770344' },
        },
        idSolicitacaoSelo: novoIdSolicitacaoSelo,
        itens: { itemSolicitacao: itensSolicitacao },
      },
    }

    const wsdlPath = path.resolve(
      __dirname,
      '../../config/wsdl/homologacao/SolicitacaoSelo.wsdl',
    )
    const operation = 'solicitaSelos'

    try {
      const response = await soapClientPromise(wsdlPath, operation, args)
      const codigoRetorno = response?.return?.codigoRetorno

      if (codigoRetorno?.codigo === 'MSG010' && codigoRetorno.status === 0) {
        throw new AppError(codigoRetorno.mensagem, 400)
      }

      const chave = response?.return?.chave
      const cabecalho = response?.return?.cabecalho

      if (!chave)
        throw new AppError('Chave não encontrada na resposta SOAP.', 400)

      await prisma.pedido.create({
        data: {
          // id: BigInt(novoIdSolicitacaoSelo),
          id: novoIdSolicitacaoSelo,
          chave,
          dataHora: new Date(cabecalho.dataHora).toISOString(),
          recebido: false,
        },
      })

      return { message: 'Pedido de selos realizado com sucesso!', chave }
    } catch (error) {
      console.error('Erro ao solicitar selos:', error)
      if (error instanceof AppError) throw error
      throw new AppError('Erro interno ao solicitar selos.', 500)
    }
  }

  private async buscarSelosPermitidos() {
    return [
      { codigoSelo: 1, cota: 1126 },
      { codigoSelo: 2, cota: 1000 },
      { codigoSelo: 3, cota: 1000 },
      { codigoSelo: 4, cota: 126 },
      { codigoSelo: 5, cota: 105 },
      { codigoSelo: 7, cota: 30 },
      { codigoSelo: 8, cota: 63 },
      { codigoSelo: 9, cota: 420 },
      { codigoSelo: 10, cota: 126 },
      { codigoSelo: 11, cota: 336 },
      { codigoSelo: 14, cota: 500 },
      { codigoSelo: 15, cota: 42 },
      { codigoSelo: 16, cota: 168 },
      { codigoSelo: 17, cota: 168 },
    ]
  }

  private validarEMontarItens(
    itens: ItemSolicitacaoInput[],
    selosPermitidos: { codigoSelo: number; cota: number }[],
  ) {
    return itens.map((item, index) => {
      const seloPermitido = selosPermitidos.find(
        (s) => s.codigoSelo === item.codigo,
      )

      if (!seloPermitido) {
        throw new AppError(`Selo código ${item.codigo} não é permitido.`, 400)
      }

      if (item.quantidade <= 0) {
        throw new AppError(
          `Quantidade inválida para o selo ${item.codigo}.`,
          400,
        )
      }

      if (item.quantidade > seloPermitido.cota) {
        throw new AppError(
          `Quantidade solicitada (${item.quantidade}) excede a cota (${seloPermitido.cota}) do selo ${item.codigo}.`,
          400,
        )
      }

      return {
        sequencial: index + 1,
        codigoSelo: { codigo: item.codigo },
        quantidade: item.quantidade,
      }
    })
  }
}
