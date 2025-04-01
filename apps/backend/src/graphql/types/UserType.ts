import { Field, ID, ObjectType } from 'type-graphql'

import { FileMetadataType } from './FileMetadataType'

@ObjectType()
export class UserType {
  @Field(() => ID)
  id!: string

  @Field()
  registeredName!: string

  @Field()
  name!: string

  @Field()
  email!: string

  @Field()
  profileImage?: string

  @Field(() => [FileMetadataType], { nullable: true })
  fileMetadata?: FileMetadataType[]
}
