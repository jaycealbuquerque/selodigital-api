import { Router } from 'express'
import { CreateRtdController } from '../../controllers/rtd/create-rtd'
import { DeleteRtdController } from '../../controllers/rtd/delete-rtd'
import { GetOneRtdController } from '../../controllers/rtd/get-one-rtd'
import { ListAllRtdController } from '../../controllers/rtd/list-all-rtd'
import { SelarAllRtdController } from '../../controllers/rtd/selar-all-rtd'
import { SelarOneRtdController } from '../../controllers/rtd/selar-one-rtd'
import { SendAllRtdController } from '../../controllers/rtd/send-all-rtd'
import { SendOneRtdController } from '../../controllers/rtd/send-one-rtd'
import { ensureAuthenticated } from '../../middlewares/ ensureAuthenticated'

const rtdRouter = Router()
const createRtdController = new CreateRtdController()
const deleteRtdController = new DeleteRtdController()
const getOneRtdController = new GetOneRtdController()
const listAllRtdController = new ListAllRtdController()
const selarAllRtdController = new SelarAllRtdController()
const selarOneRtdController = new SelarOneRtdController()
const sendAllRtdController = new SendAllRtdController()
const sendOneRtdController = new SendOneRtdController()

rtdRouter.post('/criarrtd', ensureAuthenticated, createRtdController.handle)
rtdRouter.delete('/deletertd', ensureAuthenticated, deleteRtdController.handle)
rtdRouter.get('/getonertd', ensureAuthenticated, getOneRtdController.handle)
rtdRouter.get('/listallrtd', ensureAuthenticated, listAllRtdController.handle)
rtdRouter.post(
  '/selarallrtd',
  ensureAuthenticated,
  selarAllRtdController.handle,
)
rtdRouter.post(
  '/selaronertd',
  ensureAuthenticated,
  selarOneRtdController.handle,
)
rtdRouter.post('/sendallrtd', ensureAuthenticated, sendAllRtdController.handle)
rtdRouter.post('/sendonertd', ensureAuthenticated, sendOneRtdController.handle)

export { rtdRouter }
