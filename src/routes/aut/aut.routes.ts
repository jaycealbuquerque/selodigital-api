import { Router } from 'express'
import { CreateAutController } from '../../controllers/aut/create-aut'
import { DeleteAutController } from '../../controllers/aut/delete-aut'
import { GetOneAutController } from '../../controllers/aut/get-one-aut'
import { ListAllAutController } from '../../controllers/aut/list-all-aut'
import { SelarAllAutController } from '../../controllers/aut/selar-all-aut'
import { SelarOneController } from '../../controllers/aut/selar-one-aut'
import { SendAllController } from '../../controllers/aut/send-all-aut'
import { SendOneController } from '../../controllers/aut/send-one-aut'
import { ensureAuthenticated } from '../../middlewares/ ensureAuthenticated'

const autRouter = Router()
const createAutController = new CreateAutController()
const deleteAutController = new DeleteAutController()
const getOneAutController = new GetOneAutController()
const listAllAutController = new ListAllAutController()
const selarAllAutController = new SelarAllAutController()
const selarOneController = new SelarOneController()
const sendAllController = new SendAllController()
const sendOneController = new SendOneController()

autRouter.post('/criaraut', ensureAuthenticated, createAutController.handle)
autRouter.delete('/deleteaut', ensureAuthenticated, deleteAutController.handle)
autRouter.post(
  '/getoneaut/:idAto',
  ensureAuthenticated,
  getOneAutController.handle,
)
autRouter.post(
  '/listallaut/:numeroAtendimento',
  ensureAuthenticated,
  listAllAutController.handle,
)
autRouter.post(
  '/selarallaut',
  ensureAuthenticated,
  selarAllAutController.handle,
)
autRouter.post('/selaroneaut', ensureAuthenticated, selarOneController.handle)
autRouter.post('/sendallaut', ensureAuthenticated, sendAllController.handle)
autRouter.post('/sendoneaut', ensureAuthenticated, sendOneController.handle)

export { autRouter }
