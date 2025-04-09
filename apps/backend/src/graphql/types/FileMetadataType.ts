import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class FileMetadataType {
  @Field(() => String)
  filename!: string

  @Field(() => String)
  fileUrl!: string

  @Field(() => String)
  name!: string

  @Field(() => String)
  category!: string

  @Field(() => Date, { nullable: true })
  uploadedAt?: Date
}
