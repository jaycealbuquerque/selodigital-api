import { PrismaClient } from '@prisma/client'
import { RegisterService } from '../src/services/users/register'

const prisma = new PrismaClient()

async function main() {
  const registerUseCase = new RegisterService()

  const usersData = [
    {
      nome: 'Jayce Albuquerque',
      email: 'jayce@jayce.com',
      cpf: '00000000000',
      cargo: 'Escrevente',
      password: '123456',
    },
    // {
    //   nome: 'Livia Loiola',
    //   email: 'livia@livia.com',
    //   cpf: '12345678900',
    //   cargo: 'Escrevente',
    //   password: '123456',
    // },
    // {
    //   nome: 'João Silva',
    //   email: 'joao@joao.com',
    //   cpf: '98765432100',
    //   cargo: 'Tabelião',
    //   password: '123456',
    // },
  ]

  for (const user of usersData) {
    await registerUseCase.execute(user)
  }

  await prisma.descricaoDoc.createMany({
    data: [
      {
        tipoDocumento: 1,
        descricao: 'DUT – Documento de Transferência de Veículo',
      },
      {
        tipoDocumento: 2,
        descricao: 'CRV – Certificado de Registro de Veículo',
      },
      {
        tipoDocumento: 3,
        descricao:
          'APTV-E – Autorização para transferência de Autoridade de Veículo Eletrônico',
      },
      { tipoDocumento: 4, descricao: 'Contrato de Locação' },
      { tipoDocumento: 5, descricao: 'Procuração Particular' },
      { tipoDocumento: 6, descricao: 'Contrato de Prestação de Serviço' },
      {
        tipoDocumento: 7,
        descricao: 'Contrato de Prestação de Serviço Escolares',
      },
      { tipoDocumento: 8, descricao: 'Contrato de Compra e Venda de Imóvel' },
      { tipoDocumento: 9, descricao: 'Contrato de Compra e Venda de Móveis' },
      {
        tipoDocumento: 10,
        descricao: 'Promessa de Contrato de Compra e Venda de Imóvel',
      },
      { tipoDocumento: 11, descricao: 'Declaração de Endereço (Detran)' },
      { tipoDocumento: 12, descricao: 'Plantas e Memoriais Descritivos' },
      {
        tipoDocumento: 13,
        descricao: 'ART – Anotação De Responsabilidade Técnica',
      },
      {
        tipoDocumento: 14,
        descricao: 'Requerimentos ao cartório de Registro De Imóveis',
      },
      { tipoDocumento: 15, descricao: 'Cédulas de Crédito' },
      { tipoDocumento: 16, descricao: 'Autorização de Viagem' },
      { tipoDocumento: 17, descricao: 'Autorização de Hospedagem' },
      {
        tipoDocumento: 18,
        descricao: 'Documento de Identidade (Ex: RG, CNH, CTPS, etc.)',
      },
      { tipoDocumento: 99, descricao: 'Outros' },
    ],
    skipDuplicates: true, // evita erro caso já tenham sido inseridos
  })

  await prisma.tipoAto.createMany({
    data: [
      {
        id: 1,
        tipo: 'autenticacao',
      },
      {
        id: 2,
        tipo: 'recFirmaTransfVeiculoSinalPublico',
      },
      {
        id: 3,
        tipo: 'recFirmaTransVeiculoComprador',
      },
      {
        id: 4,
        tipo: 'recFirmaTransVeiculoVendedor',
      },
      {
        id: 5,
        tipo: 'reconhecimentoFirmaPorAutenticidade',
      },
      {
        id: 6,
        tipo: 'reconhecimentoFirmaPorSemelhanca',
      },
      {
        id: 7,
        tipo: 'reconhecimentoFirmaSinalPublico',
      },
      {
        id: 8,
        tipo: 'RegistroTituloDocumentoDut',
      },
    ],
    skipDuplicates: true, // evita erro caso já tenham sido inseridos
  })

  await prisma.tipoSelo.createMany({
    data: [
      { id: 1, descricao: 'SELO - REGISTRAL DE DISTRIBUIÇÃO' },
      { id: 2, descricao: 'SELO - RECONHECIMENTO DE FIRMA' },
      { id: 3, descricao: 'SELO - AUTENTICAÇÃO' },
      { id: 4, descricao: 'SELO - CERTIDÃO/SEGUNDA VIA/ SEGUNDO TRANSLADO' },
      { id: 5, descricao: 'SELO - NOTARIAL I (PROTESTO DE TÍTULO)' },
      {
        id: 6,
        descricao:
          'SELO - NOTARIAL II (PROCURAÇÕES E ESCRITURAS SEM VALOR DECLARADO)',
      },
      {
        id: 7,
        descricao: 'SELO - NOTARIAL III (ESCRITURAS COM VALOR DECLARADO)',
      },
      { id: 8, descricao: 'SELO - REGISTRAL CIVIL DE NASCIMENTO E ÓBITO' },
      {
        id: 9,
        descricao:
          'SELO - SEGUNDAS VIAS DE NASCIMENTO OU ÓBITO E AVERBAÇÕES GRATUITAS',
      },
      { id: 10, descricao: 'SELO - REGISTRAL CASAMENTO' },
      {
        id: 11,
        descricao:
          'SELO - REGISTRAL REGISTRO DE TÍTULOS, DOCUMENTO CIVIL E DE PESSOAS JURÍDICAS',
      },
      {
        id: 12,
        descricao:
          'REGISTRAL IMÓVEIS I (AVERBAÇÕES E REGISTRO DE PACTO ANTENUPCIAL)',
      },
      { id: 13, descricao: 'SELO - REGISTRAL IMÓVEIS (OUTROS REGISTROS)' },
      {
        id: 14,
        descricao: 'SELO - RECONHECIMENTO DE FIRMA – TRANSFERÊNCIA DE VEÍCULOS',
      },
      {
        id: 15,
        descricao:
          'SELO - NOTARIAL IV – SELO ESPECIAL (ESCRITURA COM VALOR DECLARADO)',
      },
      {
        id: 16,
        descricao: 'SELO - NOTARIAL IV – SELO ESPECIAL (PROCURACAÇAO )',
      },
      { id: 99, descricao: 'SEM SELO - ATO SEM SELO' },
    ],
    skipDuplicates: true, // evita erro caso já tenham sido inseridos
  })

  console.log('Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('Erro ao rodar o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
