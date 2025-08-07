import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import 'dotenv/config'
import { AppError } from '../../erros/AppError'
import { prisma } from '../../lib/prisma'
import { gerarDataComHorarioAleatorio } from '../../utils/gerarDataComHorarioAleatorio'

dayjs.extend(utc)
dayjs.extend(timezone)

interface CriarAtendimentoInput {
  dataAtendimento: string // Ex: "2025-08-06"
}

export class CriarAtendimentoService {
  async execute({ dataAtendimento }: CriarAtendimentoInput) {
    if (!dataAtendimento) {
      throw new AppError('A data do atendimento é obrigatória.', 400)
    }

    const sequencialBase = 100

    // 🔹 Data com horário aleatório no fuso de Fortaleza
    const dataAtendimentoISO = gerarDataComHorarioAleatorio(dataAtendimento)

    // 🔹 Formatar apenas data (YYYY-MM-DD) no fuso correto
    const dataAtendimentoFormatada = dayjs(dataAtendimento)
      .tz('America/Fortaleza')
      .startOf('day') // garante hora 00:00:00
      .toDate()

    // 🔹 Agora no fuso de Fortaleza
    const dataAtoPraticado = dayjs().tz('America/Fortaleza').toDate()

    return await prisma.$transaction(async (prisma) => {
      const ultimoAtendimento = await prisma.atendimento.findFirst({
        where: {
          dataAtendimento: dataAtendimentoFormatada,
        },
        orderBy: { numeroAtendimento: 'desc' },
      })

      const sequencialAnterior = ultimoAtendimento
        ? Number(ultimoAtendimento.numeroAtendimento.toString().slice(-6))
        : sequencialBase - 1

      const sequencialAtual = sequencialAnterior + 1

      // 🔹 Gera número de atendimento usando a data no fuso de Fortaleza
      const numeroAtendimento = BigInt(
        `${dayjs(dataAtendimentoFormatada)
          .tz('America/Fortaleza')
          .format('YYYYMMDD')}${sequencialAtual.toString().padStart(6, '0')}`,
      )

      const atendimentoCriado = await prisma.atendimento.create({
        data: {
          numeroAtendimento,
          dataAtendimento: dataAtendimentoFormatada,
          dataAtoPraticado,
          dataAtoSolicitacao: dataAtendimentoISO,
        },
      })

      return atendimentoCriado
    })
  }
}
