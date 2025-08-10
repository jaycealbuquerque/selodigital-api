import { Router } from 'express'

import { ensureAuthenticated } from '../../middlewares/ ensureAuthenticated'
import { SelarAtosAtendimentoController } from '../../controllers/atos/selar-atos-atendimento'
import { DeleteOneAtoController } from '../../controllers/atos/delete-one-ato'
import { DeleteAllAtosByAtendimentoController } from '../../controllers/atos/delete-all-ato'
import { ListarAtosPorTipoController } from '../../controllers/atos/list-all-atos-by-tipo'
import { GetOneAutController } from '../../controllers/atos/get-one-aut'
import { ListAllAutController } from '../../controllers/atos/list-all-aut-by-atendimento'

const atosRouter = Router()

const selarAtosAtendimentoController = new SelarAtosAtendimentoController()
const deleteOneAtoController = new DeleteOneAtoController()
const listarAtosPorTipoController = new ListarAtosPorTipoController()
const deleteAllAtosByAtendimentoController =
  new DeleteAllAtosByAtendimentoController()
const getOneAutController = new GetOneAutController()
const listAllAutController = new ListAllAutController()

atosRouter.post(
  '/selaratos',
  ensureAuthenticated,
  selarAtosAtendimentoController.handle,
)

atosRouter.delete(
  '/deletarato',
  ensureAuthenticated,
  deleteOneAtoController.handle,
)

atosRouter.delete(
  '/deleteallato',
  ensureAuthenticated,
  deleteAllAtosByAtendimentoController.handle,
)
atosRouter.post(
  '/listartodosato',
  ensureAuthenticated,
  listarAtosPorTipoController.handle,
)
atosRouter.post(
  '/getoneaut/:idAto',
  ensureAuthenticated,
  getOneAutController.handle,
)
atosRouter.post(
  '/listallaut/:numeroAtendimento',
  ensureAuthenticated,
  listAllAutController.handle,
)

export { atosRouter }
