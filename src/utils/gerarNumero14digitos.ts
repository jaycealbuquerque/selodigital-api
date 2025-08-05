import dayjs from 'dayjs'

export function gerarNumeroSequencial(numeroAnterior, sequenciaInicial) {
  // Obtém a data atual no formato YYYYMMDD
  const dataAtual = dayjs().format('YYYYMMDD')

  // Se não passar numeroAnterior, gera direto um novo número com sequência inicial
  if (!numeroAnterior) {
    return BigInt(`${dataAtual}${sequenciaInicial.toString().padStart(6, '0')}`)
  }

  if (numeroAnterior) {
    // Converte para string (caso seja BigInt ou número)
    const numeroStr = numeroAnterior.toString()

    // Separa a parte da data e a parte sequencial
    const dataAnterior = numeroStr.slice(0, 8)
    const sequencialAnterior = parseInt(numeroStr.slice(-6), 10)

    // Se a data anterior for igual a atual, incrementa
    if (dataAnterior === dataAtual) {
      const novoSequencial = (sequencialAnterior + 1)
        .toString()
        .padStart(6, '0')
      return BigInt(`${dataAtual}${novoSequencial}`)
    }
  }

  // Caso seja outro dia ou não tenha número anterior, reinicia sequência
  return BigInt(`${dataAtual}${sequenciaInicial.toString().padStart(6, '0')}`)
}
