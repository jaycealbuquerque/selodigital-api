import { AppError } from '../../erros/AppError'
import { prisma } from '../../lib/prisma'

const NO_SEAL_TYPE = 99 // atos sem selo

interface SelarAtosPorAtendimentoInput {
  numeroAtendimento: string
}

export class SelarAtosPorAtendimentoService {
  async execute({ numeroAtendimento }: SelarAtosPorAtendimentoInput) {
    if (!numeroAtendimento) {
      throw new AppError('Número de atendimento é obrigatório.', 400)
    }

    const atendimento = await prisma.atendimento.findUnique({
      where: { numeroAtendimento: BigInt(numeroAtendimento) },
      select: { id: true, numeroAtendimento: true },
    })
    if (!atendimento) throw new AppError('Atendimento não encontrado.', 404)

    // Busca TODOS os atos do atendimento para aplicar as regras
    const todosAtos = await prisma.ato.findMany({
      where: { atendimentoId: atendimento.id },
      orderBy: { idAto: 'asc' },
      select: { idAto: true, seloId: true, tipoSeloId: true },
    })

    // Já selados (qualquer tipo)
    const atosJaSelados = todosAtos.filter((a) => a.seloId !== null)
    // Pendentes que PRECISAM de selo (exclui tipo 99)
    const atosPendentes = todosAtos.filter(
      (a) => a.seloId === null && a.tipoSeloId !== NO_SEAL_TYPE,
    )
    // Pendentes do tipo 99 (apenas para reportar/ignorar)
    const atosSemSeloPorTipo = todosAtos.filter(
      (a) => a.seloId === null && a.tipoSeloId === NO_SEAL_TYPE,
    )

    // Regra: não permitir selagem se já houver algum ato selado no atendimento e existirem pendentes
    if (atosJaSelados.length > 0 && atosPendentes.length > 0) {
      throw new AppError(
        `Não é possível selar: existem ${atosJaSelados.length} ato(s) já selado(s) neste atendimento.`,
        409,
      )
    }

    // Se não há nada a selar (só tinha 99 ou nada)
    if (atosPendentes.length === 0) {
      return {
        message:
          atosSemSeloPorTipo.length > 0
            ? 'Não há atos pendentes de selagem; somente atos do tipo 99 (sem selo) foram encontrados e ignorados.'
            : 'Nenhum ato pendente de selagem para este atendimento.',
        numeroAtendimento: atendimento.numeroAtendimento,
        totalSelados: 0,
        ignoradosTipo99: atosSemSeloPorTipo.map((a) => a.idAto),
        itens: [],
      }
    }

    // Tipos de selo necessários (por tipoSeloId)
    const tiposNecessarios = new Set(
      atosPendentes.map((a) => a.tipoSeloId.toString()),
    )

    // Busca selos disponíveis correspondentes aos tipos (assumindo codigoSelo === tipoSeloId.toString())
    const selosDisponiveis = await prisma.selo.findMany({
      where: {
        status: 0, // disponível
        codigoSelo: { in: Array.from(tiposNecessarios) },
      },
      orderBy: { id: 'asc' },
      select: {
        id: true,
        codigoSelo: true,
        numeroSerie: true,
        validador: true,
      },
    })

    // Agrupa estoque por codigoSelo (tipo)
    const poolPorTipo = new Map<
      string,
      Array<(typeof selosDisponiveis)[number]>
    >()
    for (const s of selosDisponiveis) {
      const arr = poolPorTipo.get(s.codigoSelo) ?? []
      arr.push(s)
      poolPorTipo.set(s.codigoSelo, arr)
    }

    // Verifica disponibilidade por tipo
    const faltas: Record<string, { necessario: number; disponivel: number }> =
      {}
    const necessarioPorTipo: Record<string, number> = {}
    for (const ato of atosPendentes) {
      const tipo = ato.tipoSeloId.toString()
      necessarioPorTipo[tipo] = (necessarioPorTipo[tipo] ?? 0) + 1
    }
    for (const tipo of Object.keys(necessarioPorTipo)) {
      const disponivel = (poolPorTipo.get(tipo) ?? []).length
      if (disponivel < necessarioPorTipo[tipo]) {
        faltas[tipo] = { necessario: necessarioPorTipo[tipo], disponivel }
      }
    }

    if (Object.keys(faltas).length > 0) {
      const detalhes = Object.entries(faltas)
        .map(
          ([tipo, f]) =>
            `tipoSeloId ${tipo}: necessário ${f.necessario}, disponível ${f.disponivel}`,
        )
        .join(' | ')
      throw new AppError(
        `Selos insuficientes para selar todos os atos (${detalhes}).`,
        409,
      )
    }

    // Como há estoque suficiente para TODOS os tipos, aloca FIFO
    const alocacoes: Array<{
      idAto: number
      selo: { id: number; numeroSerie: string; validador: string }
    }> = []
    for (const ato of atosPendentes) {
      const tipo = ato.tipoSeloId.toString()
      const pool = poolPorTipo.get(tipo)!
      const selo = pool.shift()! // existe pois já garantimos disponibilidade
      poolPorTipo.set(tipo, pool)
      alocacoes.push({
        idAto: ato.idAto,
        selo: {
          id: selo.id,
          numeroSerie: selo.numeroSerie,
          validador: selo.validador,
        },
      })
    }

    // Transação: vincula selos aos atos e marca selos como usados
    const resultado = await prisma.$transaction(async (tx) => {
      for (const { idAto, selo } of alocacoes) {
        await tx.ato.update({
          where: { idAto },
          data: { seloId: selo.id },
        })
        await tx.selo.update({
          where: { id: selo.id },
          data: { status: 1 }, // usado
        })
      }

      const itens = alocacoes.map((a) => ({
        idAto: a.idAto,
        seloId: a.selo.id,
        numeroSerie: a.selo.numeroSerie,
        validador: a.selo.validador,
      }))

      return {
        message: `Selagem concluída: ${alocacoes.length} ato(s) selado(s). Atos do tipo 99 foram ignorados.`,
        numeroAtendimento: atendimento.numeroAtendimento,
        totalSelados: alocacoes.length,
        ignoradosTipo99: atosSemSeloPorTipo.map((a) => a.idAto),
        itens,
      }
    })

    return resultado
  }
}
