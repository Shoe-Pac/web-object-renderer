import styled from '@emotion/styled'

const Nav = styled.nav`
  display: flex;
  gap: 15px;

  a {
    color: white;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.2s;

    &:hover {
      color: #3b82f6;
    }
  }
`

export default Nav
