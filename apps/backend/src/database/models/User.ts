import { getModelForClass, prop } from '@typegoose/typegoose'

import FileMetadata from './FileMetadata'

class User {
  @prop({ required: true })
  registeredName!: string

  @prop({ required: true })
  name!: string

  @prop({ required: true, unique: true })
  email!: string

  @prop({ required: true })
  password!: string

  @prop({ required: false, default: '' })
  profileImage?: string

  @prop({ type: () => [FileMetadata], default: [] })
  fileMetadata?: FileMetadata[]
}

const UserModel = getModelForClass(User)
export default UserModel
