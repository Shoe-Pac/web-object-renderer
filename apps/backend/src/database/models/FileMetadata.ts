import { prop } from '@typegoose/typegoose'

class FileMetadata {
  @prop({ required: true })
  filename!: string

  @prop({ required: true })
  fileUrl!: string

  @prop({ required: true })
  name!: string

  @prop({ required: true })
  category!: string

  @prop({ default: () => new Date() })
  uploadedAt?: Date
}

export default FileMetadata
