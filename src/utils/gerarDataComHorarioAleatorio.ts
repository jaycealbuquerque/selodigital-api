export function gerarDataComHorarioAleatorio(dataBase: string): Date {
  const [ano, mes, dia] = dataBase.split('-').map(Number)

  const agora = new Date()
  const hojeEhDataBase =
    agora.getFullYear() === ano &&
    agora.getMonth() === mes - 1 &&
    agora.getDate() === dia

  // Limite máximo se for hoje: agora - 2 minutos
  const limiteMaximo = hojeEhDataBase
    ? new Date(agora.getTime() - 2 * 60 * 1000)
    : new Date(ano, mes - 1, dia, 17, 59, 59)

  const limiteMinimo = new Date(ano, mes - 1, dia, 8, 0, 0)

  // Gera timestamp entre mínimo e máximo
  const timestampAleatorio =
    limiteMinimo.getTime() +
    Math.random() * (limiteMaximo.getTime() - limiteMinimo.getTime())

  return new Date(timestampAleatorio)
}
