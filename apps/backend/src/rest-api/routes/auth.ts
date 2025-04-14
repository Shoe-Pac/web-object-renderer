import { FastifyInstance } from 'fastify'

import { verifyToken } from '../../middleware/auth-verification'
import {
  authenticate,
  login,
  logout,
  ping,
  validatePassword
} from '../../rest-api/controllers/auth'

export default async function authRoutes(app: FastifyInstance) {
  app.post('/login', login)
  app.post('/logout', logout)
  app.post('/validate-password', validatePassword)

  app.post('/authenticate', { preHandler: verifyToken }, authenticate) //Protected route

  app.get('/ping', ping) //Keeping backend constantly live on Render by pinging it every 5 minutes via UptimeRobot
}
