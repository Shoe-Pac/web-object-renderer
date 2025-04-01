import { Field, ObjectType } from 'type-graphql'

import { UserType } from './UserType'

@ObjectType()
export class UserResponse {
  @Field()
  status: number

  @Field()
  message: string

  @Field(() => UserType, { nullable: true })
  user?: UserType | null
}
