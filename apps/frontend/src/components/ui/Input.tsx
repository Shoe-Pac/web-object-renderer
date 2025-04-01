import styled from '@emotion/styled'

const Input = styled.input`
  padding: 6px;
  color: white;
  background-color: #171717;
  border: 1px solid #525252;
  border-radius: 6px;
  outline: none;
  margin-bottom: ${({ theme }) => theme.spacing.mini};
  margin-top: ${({ theme }) => theme.spacing.mini};

  &:focus {
    border-color: #3b82f6;
  }
`

export default Input
