import { Router } from 'express'
import { DownloadXmlController } from '../../controllers/fermoju/download-xml'
import { GenerateXmlController } from '../../controllers/fermoju/generate-xml'
import { ListAllXmlController } from '../../controllers/fermoju/list-all-xml'
import { ensureAuthenticated } from '../../middlewares/ ensureAuthenticated'

const fermojuRouter = Router()
const downloadXmlController = new DownloadXmlController()
const generateXmlController = new GenerateXmlController()
const listAllXmlController = new ListAllXmlController()

fermojuRouter.get(
  '/downloadXml',
  ensureAuthenticated,
  downloadXmlController.handle,
)
fermojuRouter.post(
  '/generateXml',
  ensureAuthenticated,
  generateXmlController.handle,
)
fermojuRouter.get(
  '/listAllXml',
  ensureAuthenticated,
  listAllXmlController.handle,
)

export { fermojuRouter }
