import multer, { Options } from 'multer'
import { AppError } from '../erros/AppError'

// ---- filtros reutilizáveis
const pdfFileFilter: Options['fileFilter'] = (_req, file, cb) => {
  if (file.mimetype !== 'application/pdf') {
    return cb(new AppError('Apenas arquivos PDF são permitidos.', 400))
  }
  cb(null, true)
}

// ---- PDF em MEMÓRIA (o que você quer pro RTD -> base64 direto)
const pdfMemoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB (ajuste se quiser)
  fileFilter: pdfFileFilter,
})

// imageUpload
export { pdfMemoryUpload }
