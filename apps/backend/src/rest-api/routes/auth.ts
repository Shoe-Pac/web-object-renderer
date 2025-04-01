import { FastifyInstance } from 'fastify'

import { verifyToken } from '../../middleware/auth-verification'
import { authenticate, login, logout, validatePassword } from '../../rest-api/controllers/auth'

export default async function authRoutes(app: FastifyInstance) {
  app.post('/login', login)
  app.post('/logout', logout)
  app.post('/validate-password', validatePassword)

  app.get('/authenticate', { preHandler: verifyToken }, authenticate) //Protected route
}
