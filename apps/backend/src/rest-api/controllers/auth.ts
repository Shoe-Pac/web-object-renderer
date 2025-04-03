import * as bcrypt from 'bcrypt'
import { FastifyReply, FastifyRequest } from 'fastify'
import * as jwt from 'jsonwebtoken'

import UserModel from '../../database/models/User'

export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { email, password } = request.body as {
      email: string
      password: string
    }
    const user = await UserModel.findOne({ email })

    if (!user) {
      return reply.status(400).send({ error: 'Invalid email credentials' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return reply.status(400).send({ error: 'Invalid password credentials' })
    }

    const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET as string, {
      expiresIn: '1h'
    })

    //TODO production environment
    //Set HttpOnly Cookie
    // reply.setCookie('token', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production' ? true : false, // false for local development
    //   sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // "lax" for local development
    //   path: '/'
    // })

    //temporary solutuion for ngrok
    const origin = request.headers.origin || ''
    const isLocalhost = origin.includes('localhost')

    reply.setCookie('token', token, {
      httpOnly: true,
      secure: !isLocalhost, // True za HTTPS (ngrok), False za localhost
      sameSite: isLocalhost ? 'lax' : 'none', // Lax za localhost, None za ngrok
      path: '/'
      // domain: isLocalhost ? undefined : '.ngrok-free.app' // Postavi domain samo za ngrok ako je potrebno
    })

    console.log('Origin:', origin)
    console.log('isLocalhost:', isLocalhost)

    return reply.send({ message: 'Login successful' })
  } catch (error) {
    return reply.status(500).send({ error, message: 'Login failed' })
  }
}

interface UserPayload {
  id: string
  email: string
}

export const authenticate = async (
  req: FastifyRequest & { user: UserPayload },
  reply: FastifyReply
) => {
  try {
    //User data already set to cookie through middleware verifyToken prehandler function
    if (!req.user) {
      return reply.status(401).send({ error: 'Unauthorized!' })
    }

    return reply.send({
      message: `Welcome ${req.user.email}!`,
      user: req.user
    })
  } catch (error) {
    return reply.status(500).send({ error, message: 'Authentication failed' })
  }
}

export const validatePassword = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, userCurrentPassword } = request.body as {
    email: string
    userCurrentPassword: string
  }
  const user = await UserModel.findOne({ email })

  if (!user) {
    return reply.status(400).send({ error: 'Invalid user email' })
  }

  const isPasswordValid = await bcrypt.compare(userCurrentPassword.trim(), user.password)

  return reply.status(200).send({
    valid: isPasswordValid,
    message: isPasswordValid ? 'Valid password' : 'Invalid password'
  })
}

export const logout = async (_: FastifyRequest, reply: FastifyReply) => {
  reply.clearCookie('token')

  return reply.send({ message: 'Logged out' })
}
