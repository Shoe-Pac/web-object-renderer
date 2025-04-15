import {
  CopyObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { MultipartFile } from '@fastify/multipart'
import * as dotenv from 'dotenv'

import FileMetadata from './models/FileMetadata'
import UserModel from './models/User'

dotenv.config({ path: 'apps/backend/.env' })

const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

if (!accessKeyId) {
  throw new Error('AWS_ACCESS_KEY_ID is not defined')
}

if (!secretAccessKey) {
  throw new Error('AWS_SECRET_ACCESS_KEY is not defined')
}

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
})

export default s3

const copyExampleModelToUserFolder = async (userName: string) => {
  const bucketName = process.env.AWS_BUCKET_NAME
  const region = process.env.AWS_REGION

  if (!bucketName) {
    throw new Error('AWS_BUCKET_NAME is not defined')
  }

  const safeUsername = userName.replace(/\s+/g, '-')
  const sourceKey = `uploads/ExampleCat.obj`
  const destinationKey = `uploads/${safeUsername}/Animals/Cat.obj`

  const copyParams = {
    Bucket: bucketName,
    CopySource: `${bucketName}/${sourceKey}`,
    Key: destinationKey,
    ContentType: 'model/obj'
  }

  try {
    await s3.send(new CopyObjectCommand(copyParams))

    const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${destinationKey}`

    return {
      filename: 'Cat.obj',
      fileUrl,
      name: 'Cat',
      category: 'Animals',
      uploadedAt: new Date()
    }
  } catch (err) {
    console.error('Error copying example model:', err)

    return null
  }
}

const uploadObjFileToAws = async (
  file: MultipartFile,
  modelName: string,
  category: string,
  userName: string
) => {
  try {
    const fileBuffer = await file.toBuffer()

    //Normalize user inputed strings - replace empty spaces with "-"
    const safeCategory = category.replace(/\s+/g, '-')
    const safeFilename = modelName.replace(/\s+/g, '-')
    const safeUsername = userName.replace(/\s+/g, '-')
    const bucketName = process.env.AWS_BUCKET_NAME

    if (!bucketName) {
      throw new Error('AWS_BUCKET_NAME is not defined')
    }

    const params = {
      Bucket: bucketName,
      Key: `uploads/${safeUsername}/${safeCategory}/${safeFilename}.obj`,
      Body: fileBuffer,
      ContentType: file.mimetype,
      ContentLength: fileBuffer.length
    }

    await s3.send(new PutObjectCommand(params))

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${safeUsername}/${safeCategory}/${safeFilename}.obj`

    return fileUrl
  } catch (error) {
    console.error('Upload error:', error)

    return null
  }
}

const uploadImageToAws = async (file: MultipartFile, userId: string) => {
  try {
    const fileBuffer = await file.toBuffer()
    const user = await UserModel.findById(userId)

    if (!user) {
      console.error('User not found')

      return null
    }

    //Normalize user inputed string - replace empty spaces with "-"
    const safeUsername = user.registeredName.replace(/\s+/g, '-')
    const fileExtension = file.mimetype.split('/')[1] // eg. "png" from "image/png"
    let filename = `profile_image_v0` // eg. "profile_image.png"

    if (user.profileImage) {
      filename = await increaseProfileImageVersion(user.profileImage)

      await deleteCurrentProfileImageFromAws(user.profileImage)
    }

    const safeFilename = `${filename}.${fileExtension}` // eg. "profile_image.png"
    const s3Key = `uploads/${safeUsername}/${safeFilename}`
    const bucketName = process.env.AWS_BUCKET_NAME

    if (!bucketName) {
      throw new Error('AWS_BUCKET_NAME is not defined')
    }

    //Upload new profile image to AWS
    const params = {
      Bucket: bucketName,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: file.mimetype,
      ContentLength: fileBuffer.length
    }

    await s3.send(new PutObjectCommand(params))

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`

    return fileUrl
  } catch (error) {
    console.error('Upload error:', error)

    return null
  }
}

const deleteCurrentProfileImageFromAws = async (imageUrl: string) => {
  const oldS3Key = imageUrl.split('.amazonaws.com/')[1] //Extract key
  const bucketName = process.env.AWS_BUCKET_NAME

  if (!bucketName) {
    throw new Error('AWS_BUCKET_NAME is not defined')
  }

  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: oldS3Key
      })
    )
  } catch (deleteError) {
    console.error('Error deleting current profile image:', deleteError)
  }
}

const increaseProfileImageVersion = async (imageUrl: string) => {
  const currentFilename = imageUrl.split('/').pop() //Extract filename from URL
  const version = currentFilename?.substring(
    currentFilename.indexOf('_v') + 2,
    currentFilename.lastIndexOf('.')
  )

  if (version) {
    const currentVersion = parseInt(version, 10)
    const newVersion = currentVersion + 1

    return `profile_image_v${newVersion}`
  }
}

const removeModelsFromAws = async (filesToDelete: FileMetadata[]) => {
  await Promise.all(
    filesToDelete.map(async (file) => {
      try {
        const s3Key = file.fileUrl.split(`.amazonaws.com/`)[1]
        const bucketName = process.env.AWS_BUCKET_NAME

        if (!bucketName) {
          throw new Error('AWS_BUCKET_NAME is not defined')
        }

        await s3.send(
          new DeleteObjectCommand({
            Bucket: bucketName,
            Key: s3Key
          })
        )
      } catch (error) {
        console.error(`Error deleting from S3: ${file.fileUrl}`, error)
      }
    })
  )
}

export { copyExampleModelToUserFolder, removeModelsFromAws, uploadImageToAws, uploadObjFileToAws }
