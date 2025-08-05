import { Request, Response } from 'express'
import { DownloadXmlService } from '../../services/fermoju/download-xml-service'

export class DownloadXmlController {
  async handle(request: Request, response: Response) {
    const { ato } = request.body

    const downloadXmlService = new DownloadXmlService()

    const downloadXml = await downloadXmlService.execute({
      ato,
    })

    return response.json(downloadXml)
  }
}
