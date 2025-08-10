import { Router } from 'express'
import { CreateRecController } from '../../controllers/rec/create-rec'
import { ensureAuthenticated } from '../../middlewares/ ensureAuthenticated'

const recRouter = Router()
const createRecController = new CreateRecController()

recRouter.post('/criarrec', ensureAuthenticated, createRecController.handle)

export { recRouter }
