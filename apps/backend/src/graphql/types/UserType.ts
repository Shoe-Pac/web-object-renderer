import { Field, ID, ObjectType } from 'type-graphql'

import { FileMetadataType } from './FileMetadataType'

@ObjectType()
export class UserType {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  registeredName!: string

  @Field(() => String)
  name!: string

  @Field(() => String)
  email!: string

  @Field(() => String, { nullable: true })
  profileImage?: string

  @Field(() => [FileMetadataType], { nullable: true })
  fileMetadata?: FileMetadataType[]
}
