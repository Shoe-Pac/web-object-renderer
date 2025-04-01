import { FastifyInstance } from 'fastify'

import { uploadImage, uploadObjFile } from '../controllers/files'

const filesRoutes = async (app: FastifyInstance) => {
  app.post('/upload-file-aws', uploadObjFile)
  app.post('/upload-image-aws', uploadImage)
}

export default filesRoutes
