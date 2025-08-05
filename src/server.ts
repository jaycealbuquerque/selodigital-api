import express, { NextFunction, Request, Response } from 'express'
import 'express-async-errors'

import routes from './routes/route'
import { AppError } from './erros/AppError'
import { configureBigIntSerialization } from './middlewares/bigint-to-json'

configureBigIntSerialization()

const app = express()
app.use(express.json())
app.use(routes)

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      })
    }
    return response.status(500).json({
      status: 'error',
      message: `Internal server error - ${err.message}`,
    })
  },
)

app.listen(3333, () => {
  console.log('Server is running on PORT 3333')
})
