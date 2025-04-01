import { gql } from '@apollo/client'

export const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!, $password: String!) {
    createUser(name: $name, email: $email, password: $password) {
      message
      status
      user {
        id
        registeredName
        name
        email
        profileImage
        fileMetadata {
          filename
          fileUrl
          name
          category
          uploadedAt
        }
      }
    }
  }
`

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $userId: String!
    $name: String
    $email: String
    $password: String
    $profileImage: String
    $fileMetadata: FileMetadataInput
    $modelsToRemove: [String!]
  ) {
    updateUser(
      userId: $userId
      name: $name
      email: $email
      password: $password
      profileImage: $profileImage
      fileMetadata: $fileMetadata
      modelsToRemove: $modelsToRemove
    ) {
      id
      name
      email
      profileImage
      fileMetadata {
        filename
        fileUrl
        name
        category
      }
    }
  }
`
