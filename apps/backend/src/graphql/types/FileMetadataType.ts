import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class FileMetadataType {
  @Field()
  filename!: string

  @Field()
  fileUrl!: string

  @Field()
  name!: string

  @Field()
  category!: string

  @Field()
  uploadedAt?: Date
}
