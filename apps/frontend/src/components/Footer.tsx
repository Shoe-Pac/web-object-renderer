import { css } from '@emotion/react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer css={footerStyle}>
      <span>© {new Date().getFullYear()} Mirza Mesic </span>
      <span> | </span>
      <Link to="/privacy-policy">Privacy Policy</Link>
    </footer>
  )
}

const footerStyle = css`
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #262626;
  color: #888;
  font-size: 0.9rem;

  a {
    color: #3399ff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`

export default Footer
