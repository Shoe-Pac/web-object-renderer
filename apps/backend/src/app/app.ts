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
app.register(cors, (_instance) => {
  return (req, callback) => {
    let corsOptions: {
      origin: string | boolean
      credentials?: boolean
      methods?: string[]
      allowedHeaders?: string[]
    }
    const allowedOrigins = ['https://web-object-renderer.onrender.com', 'http://localhost:4001']

    if (allowedOrigins.includes(req.headers.origin as string)) {
      corsOptions = {
        origin: req.headers.origin,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
      }
    } else {
      corsOptions = { origin: false } // Blokiraj nepoznate origin-e
    }
    callback(null, corsOptions)
  }
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
