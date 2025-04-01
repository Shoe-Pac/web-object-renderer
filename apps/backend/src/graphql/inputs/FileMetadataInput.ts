import { Field, InputType } from 'type-graphql'

@InputType()
export class FileMetadataInput {
  @Field()
  filename!: string

  @Field()
  fileUrl!: string

  @Field()
  name!: string

  @Field()
  category!: string
}
