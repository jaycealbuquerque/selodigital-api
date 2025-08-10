import { Router } from 'express'
import { CreateAutController } from '../../controllers/aut/create-aut'

import { ensureAuthenticated } from '../../middlewares/ ensureAuthenticated'

const autRouter = Router()
const createAutController = new CreateAutController()

autRouter.post('/criaraut', ensureAuthenticated, createAutController.handle)

export { autRouter }
