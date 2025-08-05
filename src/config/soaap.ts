import * as fs from 'fs'
import { config } from 'dotenv'

config()

//  versao que ta funcionando
// "strong-soap": "3.4.0",

// console.log(process.env.NODE_EXTRA_CA_CERTS)
const soap = require('strong-soap').soap
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const pfx = fs.readFileSync(__dirname + '/202511.pfx')
const passphrase = 'C5@1f7@1m3@4'

/**
 * @param forever
 * Mantém a conexão viva (keep-alive) para reutilizá-la em múltiplas requisições.
 *True: Reduz a latência, evitando a reabertura de conexões repetidas.
 */
/**
 * * @param rejectUnauthorized
 * Se definido como false, permite conexões com servidores SSL que não possuem certificados válidos (ou autoassinados).
 * Usar com cuidado em produção, pois desabilita parte da verificação de segurança.
 */
/**
 * * @param strictSSL
 * Quando true, reforça a verificação completa do certificado SSL.
 * Se false, desativa a validação rigorosa de certificados, útil para servidores com certificados mal configurados.
 */
/**
 * * @param secureOptions
 * Permite definir opções avançadas de SSL. No exemplo, SSL_OP_NO_TLSv1_2 desativa o suporte para a versão TLS 1.2.
 * Útil para definir protocolos específicos ou solucionar problemas de compatibilidade.
 * ara servidores com certificados mal configurados.
 */
/**
 * * @param secureProtocol
 * Especifica o protocolo seguro a ser usado na conexão, como TLSv1_2_method.
 * Útil para garantir que uma versão específica do TLS seja utilizada.
 */
/**
 * * @param timeout
 * Define o tempo limite (em milissegundos) para a conexão com o servidor SOAP.
 * Se a conexão não for estabelecida dentro do tempo especificado, a requisição será interrompida.
 */
/**
 * @param keepAlive
 * Habilita o keep-alive, que mantém a conexão aberta para reutilização.
 *Reduz a latência e melhora o desempenho ao evitar a reabertura de conexões para cada requisição.
 */

const options = {
  wsdl_options: {
    pfx, // Certificado PFX
    passphrase, // Senha do certificado
    forever: true,
    rejectUnauthorized: false,
    strictSSL: false, // Desabilitar validação SSL se necessário
    // secureOptions: constants.SSL_OP_NO_TLSv1_2,
    // secureProtocol: 'TLSv1_2_method',
    // timeout: 30000,
    // keepAlive: true,
  },
}

export function soapClientPromise(wsdlPath, operation, args) {
  return new Promise((resolve, reject) => {
    soap.createClient(wsdlPath, options, (err, client) => {
      if (err) {
        return reject(`Erro ao criar cliente SOAP: ${err.message}`)
      }

      client.setSecurity(new soap.ClientSSLSecurityPFX(pfx, passphrase))

      client[operation](args, (err, res, envelope) => {
        console.log('Último XML Enviado:\n', client.lastRequest || '')
        if (err) {
          return reject(`Erro na operação ${operation}: ${err.message}`)
        }

        resolve(res)
      })
    })
  })
}
