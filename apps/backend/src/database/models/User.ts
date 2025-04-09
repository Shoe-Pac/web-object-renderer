import { getModelForClass, prop } from '@typegoose/typegoose'

import FileMetadata from './FileMetadata' // Provjeri da je ispravno importano

class User {
  @prop({ required: true, type: String })
  registeredName!: string

  @prop({ required: true, type: String })
  name!: string

  @prop({ required: true, type: String, unique: true })
  email!: string

  @prop({ required: true, type: String })
  password!: string

  @prop({ required: false, type: String, default: '' })
  profileImage?: string

  @prop({ type: () => [FileMetadata], default: [] })
  fileMetadata?: FileMetadata[]
}

const UserModel = getModelForClass(User)
export default UserModel
