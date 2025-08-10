import { Router } from 'express'
import { CreateRecDutController } from '../../controllers/rec-dut/create-rec-dut'
import { ensureAuthenticated } from '../../middlewares/ ensureAuthenticated'

const recDutRouter = Router()
const createRecDutController = new CreateRecDutController()

recDutRouter.post(
  '/criarrecdut',
  ensureAuthenticated,
  createRecDutController.handle,
)

export { recDutRouter }
