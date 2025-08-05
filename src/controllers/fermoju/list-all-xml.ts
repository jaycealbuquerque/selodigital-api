import { Request, Response } from 'express'
import { ListAllXmlService } from '../../services/fermoju/list-all-xml-service'

export class ListAllXmlController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const listAllXmlService = new ListAllXmlService()

    const listAllXml = await listAllXmlService.execute({
      ato,
    })

    return response.json(listAllXml)
  }
}
