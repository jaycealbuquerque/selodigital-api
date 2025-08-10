import { Router } from 'express'

import { userRoutes } from './users/users.routes'
import { autRouter } from './aut/aut.routes'
import { recDutRouter } from './rec-dut/rec-dut.routes'
import { recRouter } from './rec/rec.routes'
import { rtdRouter } from './rtd/rec.routes'
import { fermojuRouter } from './fermoju/fermoju.routes'
import { seloRouter } from './selo/selo.routes'
import { atendimentoRouter } from './atendimento/atendimento.routes'
import { atosRouter } from './atos/selo.routes'

const routes = Router()

routes.use(userRoutes)
routes.use(autRouter)
routes.use(recDutRouter)
routes.use(recRouter)
routes.use(rtdRouter)
routes.use(fermojuRouter)
routes.use(seloRouter)
routes.use(atendimentoRouter)
routes.use(atosRouter)

export default routes
