import { Router } from 'express'

import { ensureAuthenticated } from '../../middlewares/ ensureAuthenticated'

import { pdfMemoryUpload } from '../../config/upload'
import { CreateRtdController } from '../../controllers/rtd/create-rtd'

const rtdRouter = Router()
const createRtdController = new CreateRtdController()

rtdRouter.post(
  '/criarrtd',
  pdfMemoryUpload.single('arquivo'),
  ensureAuthenticated,
  createRtdController.handle,
)

export { rtdRouter }
