import { Request, Response } from 'express'
import { GenerateXmlService } from '../../services/fermoju/generate-xml-service'

export class GenerateXmlController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const generateXmlService = new GenerateXmlService()

    const generateXml = await generateXmlService.execute({
      ato,
    })

    return response.json(generateXml)
  }
}
