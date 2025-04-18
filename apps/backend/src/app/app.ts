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
  origin: [
    'http://localhost:4001',
    'https://web-object-renderer.onrender.com',
    'https://web-object-renderer.online',
    'https://web-object-render.online',
    'https://wor-0ovu.onrender.com', //Static Site instead of Web Service deployed on Render
    'https://b7fc-188-129-80-141.ngrok-free.app', //ngrok tunnel for testing and development purpose
    'https://uptimerobot.com' //UptimeRobot pinging service for keeping backend always alive
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflight: true,
  strictPreflight: false
})

// Multipart middleware
app.register(multipart, {
  attachFieldsToBody: true
})

// Auth middleware
app.register(fastifyCookie, {
  secret: process.env.JWT_SECRET,
  parseOptions: {
    httpOnly: true,
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production'
  }
})

//Enhance SEO and security
app.addHook('onSend', async (_request, reply, payload) => {
  reply.header('Link', '<https://web-object-renderer.online>; rel="canonical"')
  reply.header('X-Robots-Tag', 'index, follow')
  reply.header(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self';"
  )

  return payload
})

app.register(jwt, { secret: config.jwtSecret })

//REST routes registration
app.register(authRoutes)
app.register(filesRoutes)

export default app
