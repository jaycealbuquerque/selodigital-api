import { Router } from 'express'
import { ensureAuthenticated } from '../../middlewares/ ensureAuthenticated'
import { CreateAtendimentoController } from '../../controllers/atendimento/create-atendimento'

const atendimentoRouter = Router()
const createAtendimentoController = new CreateAtendimentoController()

atendimentoRouter.post(
  '/criaratendimento',
  ensureAuthenticated,
  createAtendimentoController.handle,
)

export { atendimentoRouter }
