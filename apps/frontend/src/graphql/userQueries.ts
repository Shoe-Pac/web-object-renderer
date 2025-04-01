import { gql } from '@apollo/client'

export const GET_USER = gql`
  query GetUser($userId: String!) {
    getUser(userId: $userId) {
      id
      name
      email
      profileImage
      fileMetadata {
        fileUrl
        name
        category
      }
    }
  }
`
