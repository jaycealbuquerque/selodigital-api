import { Router } from 'express'
import { ConsultarSelosController } from '../../controllers/selo/consultar-selos'
import { ReceberSelosController } from '../../controllers/selo/receber-selos'
import { SelosEstoqueController } from '../../controllers/selo/selos-estoque'
import { SolicitarSelosController } from '../../controllers/selo/solicitar-selos'
import { ensureAuthenticated } from '../../middlewares/ ensureAuthenticated'

const seloRouter = Router()
const consultarSelosController = new ConsultarSelosController()
const receberSelosController = new ReceberSelosController()
const selosEstoqueController = new SelosEstoqueController()
const solicitarSelosController = new SolicitarSelosController()

seloRouter.get(
  '/consultarselos',
  ensureAuthenticated,
  consultarSelosController.handle,
)
seloRouter.post(
  '/receberselos',
  ensureAuthenticated,
  receberSelosController.handle,
)
seloRouter.get(
  '/selosestoque',
  ensureAuthenticated,
  selosEstoqueController.handle,
)
seloRouter.post(
  '/solicitarselos',
  ensureAuthenticated,
  solicitarSelosController.handle,
)

export { seloRouter }
