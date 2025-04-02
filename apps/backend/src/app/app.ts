import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import Fastify from 'fastify'

import authRoutes from '../rest-api/routes/auth'
import filesRoutes from '../rest-api/routes/files'
import { config } from './config'

const app = Fastify({ logger: true, trustProxy: true })

// CORS middleware
app.register(cors, {
  origin: ['https://web-object-renderer.onrender.com', 'http://localhost:4001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflight: true,
  preflightContinue: true
})

app.addHook('onRequest', async (request, reply) => {
  reply.header('Access-Control-Allow-Origin', request.headers.origin || '*')
  reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  reply.header('Access-Control-Allow-Credentials', 'true') // Potrebno je ako koristiš cookies sa `credentials: true`
})

// Multipart middleware
app.register(multipart, {
  attachFieldsToBody: true
})

// Auth middleware
app.register(jwt, { secret: config.jwtSecret })
app.register(fastifyCookie, {
  secret: process.env.JWT_SECRET,
  parseOptions: {
    httpOnly: true,
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production'
  }
})

//REST routes registration
app.register(authRoutes)
app.register(filesRoutes)

export default app
