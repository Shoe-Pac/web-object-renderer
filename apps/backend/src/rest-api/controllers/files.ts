import { MultipartFile } from '@fastify/multipart'
import { FastifyReply, FastifyRequest } from 'fastify'

import { uploadImageToAws, uploadObjFileToAws } from '../../database/aws'
import UserModel from '../../database/models/User'

export const uploadObjFile = async (request: FastifyRequest, reply: FastifyReply) => {
  const body = request.body as {
    userId: { value: string }
    modelName: { value: string }
    category: { value: string }
    file: MultipartFile
  }
  const { userId, modelName, category, file } = body

  if (!file || !modelName || !category || !userId) {
    return reply.status(400).send({ error: 'Missing required fields' })
  }

  try {
    const user = await UserModel.findById(userId.value)

    if (!user) {
      return reply.status(404).send({ error: 'User not found' })
    }

    const fileUrl = await uploadObjFileToAws(
      file,
      modelName.value,
      category.value,
      user.registeredName
    )

    if (!fileUrl) {
      return reply.status(500).send({ error: 'Failed to upload to S3' })
    }

    return reply.send({ message: 'File uploaded successfully', fileUrl })
  } catch (error) {
    console.error('Upload error:', error)

    return reply.status(500).send({ error: 'Error uploading to S3' })
  }
}

export const uploadImage = async (request: FastifyRequest, reply: FastifyReply) => {
  const body = request.body as { userId: { value: string }; file: MultipartFile }
  const userId = body.userId?.value ?? ''
  const file = body.file

  if (!file || !userId) {
    return reply.status(400).send({ error: 'Missing required fields' })
  }

  try {
    const fileUrl = await uploadImageToAws(file, userId)

    if (!fileUrl) {
      return reply.status(500).send({ error: 'Failed to upload to S3' })
    }

    return reply.send({
      message: 'Profile image uploaded successfully',
      profileImage: fileUrl
    })
  } catch (error) {
    console.error('Upload error:', error)

    return reply.status(500).send({ error: 'Error uploading profile image' })
  }
}
