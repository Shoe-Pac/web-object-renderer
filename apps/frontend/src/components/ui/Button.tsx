import styled from '@emotion/styled'

import { ButtonProps } from '../../types/ui'

const Button = styled.button<ButtonProps>`
  background: ${({ primary, theme }) => (primary ? theme.colors.primary : theme.colors.secondary)};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  transition: 0.3s;
  cursor: pointer;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  margin-bottom: ${({ theme }) => theme.spacing.small};
  margin-top: ${({ theme }) => theme.spacing.small};

  &:hover {
    opacity: 0.8;
  }
`

export default Button
