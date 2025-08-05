import dayjs from 'dayjs'

import path from 'path'

import { config } from 'dotenv'
import { soapClientPromise } from '../../config/soaap'

config()

export class ConsultarSelosService {
  // constructor(private UsersRepository: IUsersRepository) {}

  async execute() {
    const codigoServentia = process.env.CODIGO_SERVENTIA
    const ambiente = process.env.AMBIENTE

    function gerarDataHoraAtual() {
      return dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS-03:00')
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
      },
    }

    const wsdlPath = path.resolve(
      __dirname,
      '../../config/wsdl/homologacao/SelosDisponiveis.wsdl',
    )
    const operation = 'consultaSelosDisponiveis'

    // let result

    async function run(wsdlPath, operation, args) {
      try {
        const result = await soapClientPromise(wsdlPath, operation, args)
        // console.log(
        //   'Resultado da chamada SOAP:\n',
        //   JSON.stringify(result, null, 4),
        // )
        return result
      } catch (error) {
        console.error('Erro na chamada SOAP:', error)
      }
    }

    return await run(wsdlPath, operation, args)

    // if (!user) {
    //   throw new AppError('User not found.')
    // }
  }
}
