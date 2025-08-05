import { Router } from 'express'
import { CreateRecDutController } from '../../controllers/rec-dut/create-rec-dut'
import { DeleteRecDutController } from '../../controllers/rec-dut/delete-rec-dut'
import { GetOneRecDutController } from '../../controllers/rec-dut/get-one-rec-dut'
import { ListAllRecDutController } from '../../controllers/rec-dut/list-all-rec-dut'
import { SelarAllRecDutController } from '../../controllers/rec-dut/selar-all-rec-dut'
import { SelarOneRecDutController } from '../../controllers/rec-dut/selar-one-rec-dut'
import { SendAllRecDutController } from '../../controllers/rec-dut/send-all-rec-dut'
import { SendOneRecDutController } from '../../controllers/rec-dut/send-one-rec-dut'
import { ensureAuthenticated } from '../../middlewares/ ensureAuthenticated'

const recDutRouter = Router()
const createRecDutController = new CreateRecDutController()
const deleteRecDutController = new DeleteRecDutController()
const getOneRecDutController = new GetOneRecDutController()
const listAllRecDutController = new ListAllRecDutController()
const selarAllRecDutController = new SelarAllRecDutController()
const selarOneRecDutController = new SelarOneRecDutController()
const sendAllRecDutController = new SendAllRecDutController()
const sendOneRecDutController = new SendOneRecDutController()

recDutRouter.post(
  '/criarrecdut',
  ensureAuthenticated,
  createRecDutController.handle,
)
recDutRouter.delete(
  '/deleterecdut',
  ensureAuthenticated,
  deleteRecDutController.handle,
)
recDutRouter.get(
  '/getonerecdut',
  ensureAuthenticated,
  getOneRecDutController.handle,
)
recDutRouter.get(
  '/listallrecdut',
  ensureAuthenticated,
  listAllRecDutController.handle,
)
recDutRouter.post(
  '/selarallrecdut',
  ensureAuthenticated,
  selarAllRecDutController.handle,
)
recDutRouter.post(
  '/selaronerecdut',
  ensureAuthenticated,
  selarOneRecDutController.handle,
)
recDutRouter.post(
  '/sendallrecdut',
  ensureAuthenticated,
  sendAllRecDutController.handle,
)
recDutRouter.post(
  '/sendonerecdut',
  ensureAuthenticated,
  sendOneRecDutController.handle,
)

export { recDutRouter }
