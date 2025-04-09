import { Field, InputType } from 'type-graphql'

@InputType()
export class FileMetadataInput {
  @Field(() => String)
  filename!: string

  @Field(() => String)
  fileUrl!: string

  @Field(() => String)
  name!: string

  @Field(() => String)
  category!: string
}
