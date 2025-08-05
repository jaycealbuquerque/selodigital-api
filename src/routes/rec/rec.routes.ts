import { Router } from 'express'
import { CreateRecController } from '../../controllers/rec/create-rec'
import { DeleteRecController } from '../../controllers/rec/delete-rec'
import { GetOneRecController } from '../../controllers/rec/get-one-rec'
import { ListAllRecController } from '../../controllers/rec/list-all-rec'
import { SelarAllRecController } from '../../controllers/rec/selar-all-rec'
import { SelarOneRecController } from '../../controllers/rec/selar-one-rec'
import { SendAllRecController } from '../../controllers/rec/send-all-rec'
import { SendOneRecController } from '../../controllers/rec/send-one-rec'
import { ensureAuthenticated } from '../../middlewares/ ensureAuthenticated'

const recRouter = Router()
const createRecController = new CreateRecController()
const deleteRecController = new DeleteRecController()
const getOneRecController = new GetOneRecController()
const listAllRecController = new ListAllRecController()
const selarAllRecController = new SelarAllRecController()
const selarOneRecController = new SelarOneRecController()
const sendAllRecController = new SendAllRecController()
const sendOneRecController = new SendOneRecController()

recRouter.post('/criarrec', ensureAuthenticated, createRecController.handle)
recRouter.delete('/deleterec', ensureAuthenticated, deleteRecController.handle)
recRouter.get('/getonerec', ensureAuthenticated, getOneRecController.handle)
recRouter.get('/listallrec', ensureAuthenticated, listAllRecController.handle)
recRouter.post(
  '/selarallrec',
  ensureAuthenticated,
  selarAllRecController.handle,
)
recRouter.post(
  '/selaronerec',
  ensureAuthenticated,
  selarOneRecController.handle,
)
recRouter.post('/sendallrec', ensureAuthenticated, sendAllRecController.handle)
recRouter.post('/sendonerec', ensureAuthenticated, sendOneRecController.handle)

export { recRouter }
