import { Request, Response } from 'express'
import { AuthenticateService } from '../../services/users/authenticate'

export class AuthenticateController {
  async handle(request: Request, response: Response) {
    const { email, password } = request.body

    const authenticateService = new AuthenticateService()

    const authenticate = await authenticateService.execute({
      email,
      password,
    })

    return response.json(authenticate)
    // return response.json(password)
  }
}
