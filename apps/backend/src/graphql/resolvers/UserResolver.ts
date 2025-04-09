import * as bcrypt from 'bcryptjs'
import { Arg, Mutation, Query, Resolver } from 'type-graphql'

import { removeModelsFromAws } from '../../database/aws'
import UserModel from '../../database/models/User'
import { FileMetadataInput } from '../inputs/FileMetadataInput'
import { UserResponse } from '../types/UserResponse'
import { UserType } from '../types/UserType'

@Resolver(() => UserType)
export class UserResolver {
  @Mutation(() => UserResponse)
  async createUser(
    @Arg('name', () => String) name: string,
    @Arg('email', () => String) email: string,
    @Arg('password', () => String) password: string
  ): Promise<UserResponse> {
    const hashedPassword = await bcrypt.hash(password, 10)
    const existingUser = await UserModel.findOne({ email })

    if (existingUser) {
      return {
        status: 400,
        message: 'User with given email already exists!'
      }
    }

    const user = new UserModel({
      registeredName: name,
      name,
      email,
      password: hashedPassword,
      profileImage: '',
      fileMetadata: []
    })

    await user.save()

    if (!user) {
      return {
        status: 500,
        message: 'User creation to database failed!'
      }
    }

    return {
      status: 200,
      message: 'User registration successful!',
      user: {
        ...user.toObject(),
        id: user._id.toString()
      }
    }
  }

  @Mutation(() => UserType)
  async updateUser(
    @Arg('userId', () => String) userId: string,
    @Arg('name', () => String, { nullable: true }) name?: string,
    @Arg('email', () => String, { nullable: true }) email?: string,
    @Arg('password', () => String, { nullable: true }) password?: string,
    @Arg('profileImage', () => String, { nullable: true }) profileImage?: string,
    @Arg('fileMetadata', () => FileMetadataInput, { nullable: true })
    fileMetadata?: FileMetadataInput,
    @Arg('modelsToRemove', () => [String], { nullable: true }) modelsToRemove?: string[]
  ): Promise<UserType> {
    const user = await UserModel.findById(userId)

    if (!user) {
      throw new Error('User not found!')
    }

    if (name) user.name = name
    if (email) user.email = email
    if (password) user.password = await bcrypt.hash(password, 10) //Hash new password
    if (profileImage) user.profileImage = profileImage
    if (fileMetadata) user.fileMetadata.push(fileMetadata)
    if (modelsToRemove) {
      const filesToDelete = user.fileMetadata.filter((file) => modelsToRemove.includes(file.name))

      if (filesToDelete.length === 0) {
        throw new Error('No matching files found!')
      }

      await removeModelsFromAws(filesToDelete)

      user.fileMetadata = user.fileMetadata.filter((file) => !modelsToRemove.includes(file.name))
    }

    await user.save()

    return {
      ...user.toObject(),
      id: user._id.toString()
    }
  }

  @Query(() => UserType, { nullable: true })
  async getUser(@Arg('userId', () => String) userId: string): Promise<UserType | null> {
    const user = await UserModel.findById(userId)

    if (!user) return null

    return {
      ...user.toObject(),
      id: user._id.toString()
    }
  }
}
