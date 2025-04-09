import { Field, ObjectType } from 'type-graphql'

import { UserType } from './UserType'

@ObjectType()
export class UserResponse {
  @Field(() => Number)
  status: number

  @Field(() => String)
  message: string

  @Field(() => UserType, { nullable: true })
  user?: UserType | null
}
