import { prop } from '@typegoose/typegoose'

class FileMetadata {
  @prop({ required: true, type: String })
  filename!: string

  @prop({ required: true, type: String })
  fileUrl!: string

  @prop({ required: true, type: String })
  name!: string

  @prop({ required: true, type: String })
  category!: string

  @prop({ required: false, type: Date, default: () => new Date() })
  uploadedAt?: Date
}

export default FileMetadata
