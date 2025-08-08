// controllers/rtd/create-rtd-controller.ts
import { Request, Response } from 'express'
import { AppError } from '../../erros/AppError'
import { CreateRtdService } from '../../services/rtd/create-rtd-service'

export class CreateRtdController {
  async handle(req: Request, res: Response) {
    try {
      const raw = req.body?.data
      console.log(raw)
      if (!raw) throw new AppError('Campo "data" é obrigatório.', 400)

      let payload: any
      try {
        payload = JSON.parse(raw)
      } catch {
        throw new AppError('"data" deve ser JSON válido.', 400)
      }

      if (!req.file) {
        throw new AppError('Arquivo PDF é obrigatório.', 400)
      }

      if (req.file && req.file.mimetype !== 'application/pdf') {
        throw new AppError('Arquivo deve ser PDF.', 400)
      }

      const pdfBase64 = req.file
        ? req.file.buffer.toString('base64')
        : undefined

      const service = new CreateRtdService()
      const result = await service.execute({ ...payload, pdfBase64 })

      return res.status(201).json(result)
    } catch (err: any) {
      const status = err?.statusCode ?? 500
      return res.status(status).json({ status: 'error', message: err.message })
    }
  }
}
