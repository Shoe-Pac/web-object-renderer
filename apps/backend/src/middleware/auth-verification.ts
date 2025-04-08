import { FastifyReply, FastifyRequest } from 'fastify'
import * as jwt from 'jsonwebtoken'
import { JwtPayload, Secret } from 'jsonwebtoken'

declare module 'fastify' {
  interface FastifyRequest {
    jwt: {
      verify: (token: string) => JwtPayload
    }
  }
}

export const verifyToken = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const token = request.cookies.token //Getting token from HttpOnly cookie

    if (!token) {
      return reply.status(401).send({ error: 'No token provided' })
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET as Secret) as JwtPayload

    request.user = {
      id: verified.id,
      email: verified.email
    }
  } catch (error) {
    return reply.status(401).send({ error, message: 'Invalid token' })
  }
}
