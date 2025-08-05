import { Router } from 'express'
import { AuthenticateController } from '../../controllers/users/authenticate'

const userRoutes = Router()

userRoutes.post('/authenticate', new AuthenticateController().handle)

export { userRoutes }
