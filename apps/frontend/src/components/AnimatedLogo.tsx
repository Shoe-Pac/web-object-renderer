import { css } from '@emotion/react'
import React from 'react'

const AnimatedLogo: React.FC = () => {
  return (
    <div css={containerStyle}>
      <img src="/logo.svg" alt="WOR Logo" css={logoStyle} />
    </div>
  )
}

const containerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50%;
  width: 50%;
`

const logoStyle = css`
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  height: 50%;
`

export default AnimatedLogo
